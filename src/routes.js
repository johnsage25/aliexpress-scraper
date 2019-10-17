// routes.js
const Apify = require('apify');
const extractors = require('./extractors');

const {
    utils: { log },
} = Apify;

// Categoy page crawler
// Add next page on request queue
// Fetch products from list and add all links to request queue
exports.CATEGORY = async ({ $, request }, { requestQueue }) => {
    const { baseUrl } = request.userData;

    log.info(`CRAWLER -- Fetching category link: ${request.url}`);

    // Extract sub category links
    const subCategories = await extractors.getAllSubCategories($);

    // If sub categories are more than 0
    if (subCategories.length > 0) {
        // Add all sub categories to request queue
        for (const subCategory of subCategories) {
            await requestQueue.addRequest({
                uniqueKey: subCategory.link,
                url: subCategory.link,
                userData: {
                    label: 'CATEGORY',
                    baseUrl,
                },
            });
        }
    } else {
        // Move to listing
        await requestQueue.addRequest({
            uniqueKey: `${request.url}-LIST`,
            url: request.url,
            userData: {
                label: 'LIST',
                page: 1,
                baseUrl,
            },
        });
    }


    log.debug(`CRAWLER -- Fetched ${subCategories.length} subcategories and moving to each of them`);
};

// Categoy page crawler
// Add next page on request queue
// Fetch products from list and add all links to request queue
exports.LIST = async ({ $, userInput, request }, { requestQueue }) => {
    const { endPage = -1 } = userInput;
    const { pageNum = 1, baseUrl } = request.userData;

    log.info(`CRAWLER -- Fetching category: ${request.url} with page: ${pageNum}`);

    // Extract product links
    const productLinks = await extractors.getProductsOfPage($);

    // If products are more than 0
    if (productLinks.length > 0) {
        // Check user input
        if (endPage > 0 ? pageNum + 1 <= endPage : true) {
            // Add next page of same category to queue
            await requestQueue.addRequest({
                url: `${baseUrl}?page=${pageNum + 1}&SortType=total_tranpro_desc`,
                userData: {
                    label: 'CATEGORY',
                    pageNum: pageNum + 1,
                    baseUrl,
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
exports.PRODUCT = async ({ $, userInput, request }, { requestQueue }) => {
    const { productId } = request.userData;
    const { includeDescription } = userInput;

    log.info(`CRAWLER -- Fetching product: ${productId}`);

    // Fetch product details
    const product = await extractors.getProductDetail($, request.url);

    // Check description option
    if (includeDescription) {
        // Fetch description
        await requestQueue.addRequest({
            url: product.descriptionURL,
            userData: {
                label: 'DESCRIPTION',
                product,
            },
        }, { forefront: true });
    } else {
        // Push data
        await Apify.pushData({ ...product });
        log.debug(`CRAWLER -- Fetching product: ${productId} completed and successfully pushed to dataset`);
    }
};


// Description page crawler
// Fetches description detail and push data
exports.DESCRIPTION = async ({ $, request }) => {
    const { product } = request.userData;

    log.info(`CRAWLER -- Fetching product description: ${product.id}`);

    // Fetch product details
    const description = await extractors.getProductDescription($);
    product.description = description;
    delete product.descriptionURL;

    // Push data
    await Apify.pushData({ ...product });

    log.debug(`CRAWLER -- Fetching product description: ${product.id} completed and successfully pushed to dataset`);
};
