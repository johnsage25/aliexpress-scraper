const Apify = require('apify');
const Promise = require('bluebird');
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

    // Fetch start urls
    const { startUrls } = userInput;

    if (startUrls.length === 0) {
        throw new Error('Start URLs must be defined');
    } else {
        const mappedStartUrls = tools.mapStartUrls(startUrls);
        // Initialize first requests
        for (const mappedStartUrl of mappedStartUrls) {
            await requestQueue.addRequest({
                ...mappedStartUrl,
            });
        }
    }


    const agent = await tools.getProxyAgent(userInput);

    // Create route
    const router = tools.createRouter({ requestQueue });

    log.info('PHASE -- SETTING UP CRAWLER.');
    const crawler = new Apify.CheerioCrawler({
        requestQueue,
        handlePageTimeoutSecs: 99999,
        maxRequestRetries: 10,
        requestTimeoutSecs: 300,
        maxConcurrency: userInput.maxConcurrency,
        ignoreSslErrors: true,
        // Proxy options
        ...(userInput.proxy.useApifyProxy ? { useApifyProxy: userInput.proxy.useApifyProxy } : {}),
        ...(userInput.proxy.apifyProxyGroups ? { apifyProxyGroups: userInput.proxy.apifyProxyGroups } : {}),
        ...(userInput.proxy.proxyUrls ? { proxyUrls: userInput.proxy.proxyUrls } : {}),
        prepareRequestFunction: ({ request }) => {
            request.headers = {
                Connection: 'keep-alive',
                'User-Agent': Apify.utils.getRandomUserAgent(),
            };

            return request;
        },
        handlePageFunction: async (context) => {
            const { request, response, $ } = context;

            log.debug(`CRAWLER -- Processing ${request.url}`);

            // Status code check
            if (!response || response.statusCode !== 200
                || request.url.includes('login.')
                || $('body').data('spm') === 'buyerloginandregister') {
                throw new Error(`We got blocked by target on ${request.url}`);
            }

            if (request.userData.label !== 'DESCRIPTION' && !$('script').text().includes('runParams')) {
                throw new Error(`We got blocked by target on ${request.url}`);
            }

            if ($('html').text().includes('/_____tmd_____/punish')) {
                throw new Error(`We got blocked by target on ${request.url}`);
            }

            // Random delay
            await Promise.delay(Math.random() * 3000);

            // Add user input to context
            context.userInput = userInput;
            context.agent = agent;

            // Redirect to route
            await router(request.userData.label, context);
        },
    });

    log.info('PHASE -- STARTING CRAWLER.');

    await crawler.run();

    log.info('PHASE -- ACTOR FINISHED.');
});
