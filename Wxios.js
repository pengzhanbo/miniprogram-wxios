var InterceptorManger = require('./interceptorManger');
var dispatchRequest = require('./dispatchRequest');
var utils = require('./utils');
/**
 * @class Wxios
 * @param {Object} config 请求配置
 */
function Wxios(config) {
    this.defaults = config;
    this.interceptors = {
        request: new InterceptorManger(),
        response: new InterceptorManger()
    };
}

/**
 * 请求方法
 * @param {Object} config
 */
Wxios.prototype.request = function request(config) {
    if (typeof config === 'string') {
        config = Object.assign({
            url: arguments[0]
        }, arguments[1] || {});
    }

    config = utils.merge({}, this.defaults, {method: 'get'}, config);
    config.method = config.method.toLowerCase();

    var chain = [dispatchRequest, undefined];
    var promise = Promise.resolve(config);

    this.interceptors.request.forEach(interceptor => {
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    this.interceptors.response.forEach(interceptor => {
        chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
};

['delete', 'get', 'head', 'options', 'post', 'put', 'patch'].forEach(method => {
    Wxios.prototype[method] = function (url, data, config) {
        return this.request(Object.assign(config || {}, {
            method: method,
            url: url,
            data: data
        }));
    };
});

module.exports = Wxios;
