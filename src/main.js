const Apify = require('apify');
const tools = require('./tools');

const {
    utils: { log },
} = Apify;


// Create crawler
Apify.main(async () => {
    log.info('PHASE -- STARTING ACTOR.');

    const userInput = await Apify.getInput();

    log.info('ACTOR OPTIONS: -- ', userInput);

    // Create request queue
    const requestQueue = await Apify.openRequestQueue();

    // Initialize first request
    const homepage = await tools.getSources();
    await requestQueue.addRequest({ ...homepage });

    // Create route
    const router = tools.createRouter({ requestQueue });

    log.info('PHASE -- SETTING UP CRAWLER.');
    const crawler = new Apify.CheerioCrawler({
        requestQueue,
        handlePageTimeoutSecs: 99999,
        maxRequestRetries: 10,
        maxConcurrency: userInput.maxConcurrency,
        minConcurrency: userInput.minConcurrency,
        ignoreSslErrors: true,
        // Proxy options
        ...(userInput.useApifyProxy ? { useApifyProxy: userInput.useApifyProxy } : {}),
        ...(userInput.apifyProxyGroups ? { apifyProxyGroups: userInput.apifyProxyGroups } : {}),
        ...(userInput.proxyUrls ? { proxyUrls: userInput.proxyUrls } : {}),
        handlePageFunction: async (context) => {
            const { request, response, $ } = context;
            log.debug(`CRAWLER -- Processing ${request.url}`);

            // Status code check
            if (!response || response.statusCode !== 200 || request.url.includes('login.') || !$('body').data() || $('body').data('spm') === 'buyerloginandregister') {
                throw new Error(`We got blocked by target on ${request.url}`);
            }

            // Add user input to context
            context.userInput = userInput;

            // Redirect to route
            await router(request.userData.label, context);
        },
    });

    log.info('PHASE -- STARTING CRAWLER.');

    await crawler.run();

    log.info('PHASE -- ACTOR FINISHED.');
});
