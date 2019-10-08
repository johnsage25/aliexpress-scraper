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
exports.createProxyUrl = (userInput) => {
    return `http://country-${userInput.country}:${process.env.APIFY_PROXY_PASSWORD}@proxy.apify.com:8000`;
};

// Creates language option with user input
exports.getLanguageOfBrowser = (userInput) => {
    let lang = '';
    switch (userInput.country) {
        case 'US':
            lang = 'en-US, en';
            break;
        case 'DE':
            lang = 'de-DE, de';
            break;
        case 'FR':
            lang = 'fr-FR, fr';
            break;

        default:
            break;
    }

    return lang;
};

// Returns an axios instance with proxy and timeout options set
exports.getProxyAgent = (userInput) => {
    return new HttpsProxyAgent(this.createProxyUrl(userInput));
};
