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
    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,
        gotoTimeoutSecs: 120,
        handlePageTimeoutSecs: 99999,
        maxRequestRetries: 10,
        maxConcurrency: userInput.maxConcurrency,
        minConcurrency: userInput.minConcurrency,
        useLiveView: userInput.liveView,
        launchPuppeteerFunction: async () => Apify.launchPuppeteer({
            // Proxy options
            proxyUrl: tools.createProxyUrl(),
            userAgent: Apify.utils.getRandomUserAgent(),
            headless: true,
            stealth: true,
            args: ['--lang=en-US,en'],
        }),
        gotoFunction: async ({ request, page }) => {
            // goto options
            return page.goto(request.url, {
                timeout: 0,
                waitUntil: 'load',
            });
        },
        handlePageFunction: async (context) => {
            const { request, response, page } = context;
            log.debug(`CRAWLER -- Processing ${request.url}`);

            // Status code check
            const status = response.status();
            if (status !== 200) return;

            // Add user input to context
            context.userInput = userInput;

            // Random delay
            await page.waitFor(Math.random() * 1000);

            // Redirect to route
            await router(request.userData.label, context);
        },
    });

    log.info('PHASE -- STARTING CRAWLER.');

    await crawler.run();

    log.info('PHASE -- ACTOR FINISHED.');
});
