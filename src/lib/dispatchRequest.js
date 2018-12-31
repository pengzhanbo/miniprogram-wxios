import {
    isAbsoluteURL,
    combURL,
    merge,
    forEach
} from './utils';
import request from './request';

export default function dispatchRequest(config) {
    if (config.baseURL && !isAbsoluteURL(config.url)) {
        config.url = combURL(config.baseURL, config.url);
    }
    // 合并处理 headers
    config.headers = merge(
        {},
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers || {}
    );
    forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], method => {
        delete config.headers[method];
    });

    return request(config);
}
