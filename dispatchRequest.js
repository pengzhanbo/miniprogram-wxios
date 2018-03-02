var utils = require('./utils');
var wxRequest = require('./wxRequest');

module.exports = function dispatchRequest(config) {
    // 合并处理 baseURL
    if (config.baseURL && !utils.isAbsoluteURL(config.url)) {
        config.url = utils.combURL(config.baseURL, config.url);
    }

    // 合并处理 headers
    config.headers = utils.merge(
        {},
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers || {}
    );
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'].forEach(method => {
        delete config.headers[method];
    });

    return wxRequest(config);
};
