// routes.js
const Apify = require('apify');
const Promise = require('bluebird');
const extractors = require('./extractors');

const {
    utils: { log },
} = Apify;


// Home page crawler.
// Checks user input and create category links
// Adds categories to request queue
exports.HOME = async ({ page, userInput, request }, { requestQueue }) => {
    const { startPage = 0, categoryStartIndex = 0, categoryEndIndex = null } = userInput;

    log.info('CRAWLER -- Fetching Categories');

    // Extract all categories
    const mainCategoryPaths = await extractors.getAllMainCategoryPaths(page);

    // Get all subcategory links
    const subCategories = await extractors.getAllSubCategories(request.url, mainCategoryPaths, page);

    log.info(`CRAWLER -- Fetched total of ${subCategories.length} categories`);

    // Filter categories if needed
    const filteredSubCategories = extractors.filterSubCategories(categoryStartIndex, categoryEndIndex, subCategories);

    // Adding all subcategory links to queue
    for (const filteredSubCategory of filteredSubCategories) {
        await requestQueue.addRequest({
            url: `${filteredSubCategory}?SortType=total_tranpro_desc`,
            userData: {
                label: 'CATEGORY',
                pageNum: startPage || 1,
                categoryBaseURL: filteredSubCategory,
            },
        }, { forefront: true });
    }

    log.debug(`CRAWLER -- ${filteredSubCategories.length} categories added to queue`);
};


// Categoy page crawler
// Add next page on request queue
// Fetch products from list and add all links to request queue
exports.CATEGORY = async ({ page, userInput, request }, { requestQueue }) => {
    const { endPage = -1 } = userInput;
    const { pageNum = 1, categoryBaseURL } = request.userData;

    log.info(`CRAWLER -- Fetching category: ${request.url} with page: ${pageNum}`);

    // Extract product links
    const productLinks = await extractors.getProductsOfPage(page);

    // If products are more than 0
    if (productLinks.length > 0) {
        // Check user input
        if (endPage > 0 ? pageNum + 1 <= endPage : true) {
            // Add next page of same category to queue
            await requestQueue.addRequest({
                url: `${categoryBaseURL}?page=${pageNum + 1}&SortType=total_tranpro_desc`,
                userData: {
                    label: 'CATEGORY',
                    pageNum: pageNum + 1,
                    categoryBaseURL,
                },
            });
        }


        // Add all products to request queue
        for (const productLink of productLinks) {
            await requestQueue.addRequest({
                uniqueKey: `${productLink.id}`,
                url: `https:${productLink.link}`,
                userData: {
                    label: 'PRODUCT',
                    productId: productLink.id,
                },
            }, { forefront: true });
        }
    } else {
        // End of category with page
        log.debug(`CRAWLER -- Last page of category: ${request.url} with page: ${pageNum}.`);
    }


    log.debug(`CRAWLER -- Fetched product links from ${request.url} with page: ${pageNum}`);
};


// Product page crawler
// Fetches product detail from detail page
exports.PRODUCT = async ({ page, userInput, request }) => {
    const { productId } = request.userData;
    const { includeQuestions = false, includeFeedbacks = false, includeDescription = false } = userInput;

    log.info(`CRAWLER -- Fetching product: ${productId}`);

    // Fetch product details
    const product = await extractors.getProductDetail(page);

    // Check description option
    if (includeDescription) {
        // Delay in random
        await Promise.delay(Math.random() * 1000);

        // Fetch description
        const { description, overview } = await extractors.getProductDescription(product.descriptionURL, page);
        product.description = description;
        product.overview = overview;
        delete product.descriptionURL;
    }

    // Check feedback option
    if (includeFeedbacks) {
        // Delay in random
        await Promise.delay(Math.random() * 1000);

        // Get Feedbacks
        product.feedbacks = await extractors.getProductFeedbacks(userInput, product.id, request.url, product.companyId, product.memberId);
        delete product.companyId;
        delete product.memberId;
    }

    // Check question option
    if (includeQuestions) {
        // Delay in random
        await Promise.delay(Math.random() * 1000);

        // Fetch questions
        product.questions = await extractors.getProductQuestions(userInput, productId, request.url);
    }

    // Push data
    await Apify.pushData({ ...product });

    log.debug(`CRAWLER -- Fetching product: ${productId} completed and successfully pushed to dataset`);
};
