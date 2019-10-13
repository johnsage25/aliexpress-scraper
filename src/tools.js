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
    const { apifyProxyGroups } = await Apify.getInput();
    return `http://${apifyProxyGroups || 'auto'}:${process.env.APIFY_PROXY_PASSWORD}@proxy.apify.com:8000`;
};

// Returns an axios instance with proxy and timeout options set
exports.getProxyAgent = () => {
    return new HttpsProxyAgent(this.createProxyUrl());
};
