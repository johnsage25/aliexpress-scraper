const Apify = require('apify');
const HttpsProxyAgent = require('https-proxy-agent');
const routes = require('./routes');

const {
    utils: { log },
} = Apify;

// Retrieves sources and returns object for request list
exports.getSources = async () => {
    log.debug('Getting sources');
    return {
        url: 'https://www.aliexpress.com/',
        userData: {
            label: 'HOME',
        },
    };
};

// Create router
exports.createRouter = (globalContext) => {
    return async function (routeName, requestContext) {
        const route = routes[routeName];
        if (!route) throw new Error(`No route for name: ${routeName}`);
        log.debug(`Invoking route: ${routeName}`);
        return route(requestContext, globalContext);
    };
};

// Creates proxy URL with user input
exports.createProxyUrl = async () => {
    const { apifyProxyGroups, useApifyProxy, proxyUrls } = global.userInput;
    if (proxyUrls && proxyUrls.length > 0) {
        return proxyUrls[0];
    }

    if (useApifyProxy) {
        return `http://${apifyProxyGroups ? apifyProxyGroups.join(',') : 'auto'}:${process.env.APIFY_PROXY_PASSWORD}@proxy.apify.com:8000`;
    }

    return '';
};

// Returns an axios instance with proxy and timeout options set
exports.getProxyAgent = async () => {
    const url = await this.createProxyUrl();
    return new HttpsProxyAgent(url);
};
