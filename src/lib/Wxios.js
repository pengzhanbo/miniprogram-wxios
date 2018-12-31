import Interceptor from './Interceptor';
import dispatchRequest from './dispatchRequest';
import {
    merge,
    forEach
} from './utils';

class Wxios {
    constructor(config) {
        this.defaults = config || {};
        this.interceptors = {
            request: new Interceptor(),
            response: new Interceptor()
        };
    }
    request(config) {
        if (typeof config === 'string') {
            config = Object.assign({
                url: arguments[0]
            }, arguments[1] || {});
        }
    
        config = merge({}, this.defaults, {method: 'get'}, config);
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
    }
}

forEach(['delete', 'get', 'head', 'options', 'post', 'put', 'patch'], method => {
    Wxios.prototype[method] = function (url, data, config) {
        return this.request(Object.assign(config || {}, {
            method: method,
            url: url,
            data: data
        }));
    };
});

export default Wxios;
