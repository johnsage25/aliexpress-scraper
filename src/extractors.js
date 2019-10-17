const Apify = require('apify');
const axios = require('axios');
const uniqBy = require('lodash/uniqBy');
const qs = require('querystring');
const cheerio = require('cheerio');
const safeEval = require('safe-eval');

// Fetch all main category paths from homepage
const getAllMainCategoryPaths = ($) => {
    return $('dd.sub-cate').map((i, el) => $(el).data('path')).get();
};

// Fetch every subcategory hidden pages (loaders)
const getAllSubCategories = async (base, mainCategoryPaths) => {
    let subCategories = [];

    // Fetch all subcategories
    for (const categoryPath of mainCategoryPaths) {
        // Fetch subcategory page
        const { data } = await axios.get(
            `${base}/api/load_ams_path.htm?path=aliexpress.com/common/@langField/ru/${categoryPath}.htm`,
            {
                timeout: 0,
                rejectUnauthorized: false,
            },
        );

        // Load to cheerio
        const temp$ = cheerio.load(data);

        // Fetch links
        subCategories = subCategories
            .concat(temp$('a')
                .map((i, el) => temp$(el).attr('href').split('?')[0]).get()
                .filter(link => /\/category\//.test(link)));
    }

    return uniqBy(subCategories);
};

// Filters sub categories with given options
const filterSubCategories = (categoryStartIndex = 0, categoryEndIndex = null, subCategories) => {
    // Calculate end index
    const endIndex = categoryEndIndex > 0 ? categoryEndIndex : subCategories.length - 1;

    // Slice array
    return subCategories.slice(categoryStartIndex, endIndex);
};

// Fetch all products from a global object `runParams`
const getProductsOfPage = ($) => {
    const dataScript = $($('script').filter((i, script) => $(script).html().includes('runParams')).get()[0]).html();

    return JSON.parse(
        dataScript.split('window.runParams = ')[2].split('window.runParams.csrfToken =')[0].replace(/;/g, ''),
    ).items.map(item => ({ id: item.productId, name: item.title, link: item.productDetailUrl }));
};

// Fetch basic product detail from a global object `runParams`
const getProductDetail = ($, url) => {
    const dataScript = $($('script').filter((i, script) => $(script).html().includes('runParams')).get()[0]).html();

    const { data } = safeEval(dataScript.split('window.runParams = ')[1].split('var GaData')[0].replace(/;/g, ''));

    const {
        actionModule,
        titleModule,
        storeModule,
        specsModule,
        imageModule,
        descriptionModule,
        skuModule,
        crossLinkModule,
        recommendModule,
        commonModule,
    } = data;


    return {
        id: actionModule.productId,
        link: url,
        title: titleModule.subject,
        tradeAmount: `${titleModule.tradeCount ? titleModule.tradeCount : ''} ${titleModule.tradeCountUnit ? titleModule.tradeCountUnit : ''}`,
        averageStar: titleModule.feedbackRating.averageStar,
        descriptionURL: descriptionModule.descriptionUrl,
        store: {
            followingNumber: storeModule.followingNumber,
            establishedAt: storeModule.openTime,
            positiveNum: storeModule.positiveNum,
            positiveRate: storeModule.positiveRate,
            name: storeModule.storeName,
            id: storeModule.storeNum,
            url: `https:${storeModule.storeURL}`,
            topRatedSeller: storeModule.topRatedSeller,
        },
        specs: specsModule.props.map((spec) => {
            const obj = {};
            obj[spec.attrName] = spec.attrValue;
            return obj;
        }),
        categories: crossLinkModule.breadCrumbPathList
            .map(breadcrumb => breadcrumb.target)
            .filter(breadcrumb => breadcrumb),
        wishedCount: actionModule.itemWishedCount,
        quantity: actionModule.totalAvailQuantity,
        photos: imageModule.imagePathList,
        skuOptions: skuModule.productSKUPropertyList ? skuModule.productSKUPropertyList
            .map(skuOption => ({
                name: skuOption.skuPropertyName,
                values: skuOption.skuPropertyValues
                    .map(skuPropVal => skuPropVal.propertyValueDefinitionName),
            })) : [],
        prices: skuModule.skuPriceList.map(skuPriceItem => ({
            price: skuPriceItem.skuVal.skuAmount.formatedAmount,
            attributes: skuPriceItem.skuPropIds.split(',')
                .map(propId => (skuModule.productSKUPropertyList ? skuModule.productSKUPropertyList
                    .reduce((arr, obj) => { return arr.concat(obj.skuPropertyValues); }, [])
                    .find(propVal => propVal.propertyValueId === parseInt(propId, 10)).propertyValueName : null)),
        })),
        companyId: recommendModule.companyId,
        memberId: commonModule.sellerAdminSeq,
    };
};


// Get description HTML of product
const getProductDescription = async (descriptionURL, agent) => {
    const { data } = await axios({
        method: 'GET',
        url: descriptionURL,
        agent,
        withCredentials: true,
        rejectUnauthorized: false,
    });

    const temp$ = cheerio.load(data);


    return {
        description: temp$('img').map((i, img) => temp$(img).attr('src')).get(),
        overview: temp$.html(),
    };
};


// Fetch feedbacks recursively
const getProductFeedbacks = async (userInput, id, url, companyId, memberId, agent) => {
    let currentPage = 0;
    let summary;
    const fullFeedbacks = [];

    while (true) {
        // Send request
        const { data } = await axios({
            method: 'POST',
            url: 'https://feedback.aliexpress.com/display/productEvaluation.htm',
            headers: {
                'User-Agent': Apify.utils.getRandomUserAgent(),
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            agent,
            withCredentials: true,
            data: qs.stringify({
                withAdditionalFeedback: false,
                withPersonalInfo: false,
                withPictures: false,
                i18n: true,
                currentPage,
                page: currentPage + 1,
                productId: id,
                ownerMemberId: memberId,
            }),
            rejectUnauthorized: false,
        });

        // Load it to cheerio
        const $ = cheerio.load(data);

        // Parse data and return
        const feedbacks = $('.feedback-item').map((i, el) => ({
            user: {
                name: $(el).find('.user-name a').text(),
                country: $(el).find('.user-country b').text(),
            },
            rating: parseInt(
                $(el).find('.f-rate-info .star-view span')
                    .attr('style')
                    .replace('width:', '', '%', ''), 10,
            ) * 5 / 100,
            specs: $(el).find('.user-order-info span')
                .map((si, spec) => $(spec).text().replace(/(\n|\t)/g, '').replace(/  +/g, ' ')
                    .trim()).get(),
            date: $(el).find('.r-time').text(),
            review: $(el).find('.buyer-feedback span:not(.r-time-new)').text(),
            photos: $(el).find('.fb-main .f-content .buyer-review > .r-photo-list li').map((pi, photoItem) => $(photoItem).data('src')).get(),
            additionalFeedback: {
                text: $(el).find('.buyer-additional-review .buyer-addition-feedback').text(),
                photos: $(el).find('.buyer-additional-review .r-photo-list li')
                    .map((ai, photoItem) => $(photoItem).data('src')).get(),
            },
            sellerReply: $(el).find('.seller-reply .r-fulltxt').text(),
        })).get();

        if (!summary) {
            summary = $('.rate-list li').map((index, el) => ({
                attribute: $(el).find('.r-title').text(),
                value: $(el).find('.r-num').text(),
            })).get();
        }
        // Quit recursiveness
        if (feedbacks.length === 0) {
            return {
                summary,
                feedbacks: fullFeedbacks,
            };
        }

        fullFeedbacks.push(...feedbacks);
        currentPage++;
    }
};


// Fetch product questions recursively
const getProductQuestions = async (userInput, id, url, agent) => {
    const fullQuestions = [];
    let currentPage = 1;
    // Send request
    while (true) {
        const { data } = await axios({
            method: 'GET',
            url: `https://www.aliexpress.com/aeglodetailweb/api/questions?productId=${id}&currentPage=${currentPage}&pageSize=500`,
            headers: {
                'User-Agent': Apify.utils.getRandomUserAgent(),
                referer: url,
                Accept: '*/*',
                'Cache-Control': 'no-cache',
                Host: 'www.aliexpress.com',
            },
            agent,
            withCredentials: true,
            rejectUnauthorized: false,
        });

        // Quit recursion
        if (!data || !data.body || !data.body.questionList || data.body.questionList.length === 0) {
            return fullQuestions;
        }

        const questions = data.body.questionList;

        // Recursively continue;
        fullQuestions.push(...questions);
        currentPage++;
    }
};


module.exports = {
    getAllMainCategoryPaths,
    getAllSubCategories,
    filterSubCategories,
    getProductsOfPage,
    getProductDetail,
    getProductDescription,
    getProductFeedbacks,
    getProductQuestions,
};
