const Apify = require('apify');
const axios = require('axios');
const Promise = require('bluebird');
const uniqBy = require('lodash/uniqBy');
const qs = require('querystring');
const cheerio = require('cheerio');
const tools = require('./tools');

// Fetch all main category paths from homepage
const getAllMainCategoryPaths = async page => page.evaluate(async () => {
    return Array.from(
        document.querySelectorAll('.categories-list-box .cl-item .sub-cate'),
    ).map(subCategory => subCategory.dataset.path);
});


// Fetch every subcategory hidden pages (loaders)
const getAllSubCategories = async (base, mainCategoryPaths, page) => {
    let subCategories = [];

    // Fetch all subcategories
    for (const categoryPath of mainCategoryPaths) {
        // Random delay
        await page.waitFor(Math.random() * 1000);

        // Go to subcategory page
        await page.goto(`${base}/api/load_ams_path.htm?path=aliexpress.com/common/@langField/ru/${categoryPath}.htm`, { timeout: 0 });

        // Fetch links
        subCategories = subCategories.concat(
            await page.evaluate(async () => {
                return Array.from(
                    document.querySelectorAll('a'),
                ).map(el => el.href.split('?')[0]).filter(link => /\/category\//.test(link));
            }),
        );
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
const getProductsOfPage = async (page) => {
    await page.waitForFunction('window.runParams !== null', { timeout: 120000 });
    return page.evaluate(async () => {
        const { items } = window.runParams;
        return items.map(product => ({
            id: product.productId,
            link: product.productDetailUrl.split('?')[0],
        }));
    });
};


// Fetch basic product detail from a global object `runParams`
const getProductDetail = async page => page.evaluate(async () => {
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
    } = window.runParams.data;


    return {
        id: actionModule.productId,
        link: window.location.href,
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
        skuOptions: skuModule.productSKUPropertyList
            .map(skuOption => ({
                name: skuOption.skuPropertyName,
                values: skuOption.skuPropertyValues
                    .map(skuPropVal => skuPropVal.propertyValueDefinitionName),
            })),
        prices: skuModule.skuPriceList.map(skuPriceItem => ({
            price: skuPriceItem.skuVal.skuAmount.formatedAmount,
            attributes: skuPriceItem.skuPropIds.split(',')
                .map(propId => skuModule.productSKUPropertyList
                    .reduce((arr, obj) => { return arr.concat(obj.skuPropertyValues); }, [])
                    .find(propVal => propVal.propertyValueId === parseInt(propId, 10)).propertyValueName),
        })),
        companyId: recommendModule.companyId,
        memberId: commonModule.sellerAdminSeq,
    };
});


// Get description HTML of product
const getProductDescription = async (descriptionURL, page) => {
    // Random delay
    await page.waitFor(Math.random() * 1000);

    // Fetch description HTML
    await page.goto(descriptionURL, { timeout: 0 });

    return page.evaluate(async () => {
        return {
            description: Array.from(document.querySelectorAll('img')).map(img => img.src),
            overview: document.querySelector('body'),
        };
    });
};


// Fetch feedbacks recursively
const getProductFeedbacks = async (userInput, id, url, companyId, memberId, currentPage = 1) => {
    // Send request
    const { data } = await axios({
        method: 'POST',
        url: 'https://feedback.aliexpress.com/display/productEvaluation.htm',
        headers: {
            'User-Agent': Apify.utils.getRandomUserAgent(),
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        agent: tools.getProxyAgent(),
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

    // Quit recursiveness
    if (feedbacks.length === 0) {
        return [];
    }

    // Random delay
    await Promise.delay(Math.random() * 1000);

    // Recursively call itself
    return feedbacks.concat(await getProductFeedbacks(userInput, id, url, companyId, memberId, currentPage + 1));
};


// Fetch product questions recursively
const getProductQuestions = async (userInput, id, url, currentPage = 1) => {
    // Send request
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
        agent: tools.getProxyAgent(),
        withCredentials: true,
    });

    // Quit recursion
    if (!data || !data.body || !data.body.questionList || data.body.questionList.length === 0) {
        return [];
    }

    // Random delay
    await Promise.delay(Math.random() * 1000);

    const questions = data.body.questionList;

    // Recursively continue;
    return questions.concat(await getProductQuestions(userInput, id, url, currentPage + 1));
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
