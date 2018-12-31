export function forEach(obj, fn) {
    if (obj === null || typeof obj === 'undefined') return;
    if (typeof obj !== 'object') {
        obj = [obj];
    }
    if (Array.isArray(obj)) {
        obj.forEach(fn);
    } else {
        obj.keys(obj).forEach(key => {
            fn.call(null, obj[key], key, obj);
        });
    }
}

export function bind(fn, thisArg) {
    return function (...arg) {
        return fn.apply(thisArg, arg);
    }
}

export function merge(...arg) {
    var result = {};
    function assign(val, key) {
        if (typeof result[key] === 'object' && typeof val === 'object') {
            result[key] = merge(result[key], val);
        } else {
            result[key] = val;
        }
    }
    arg.forEach(item => {
        forEach(item, assign);
    });
    return result;
}

export function combURL(baseUrl, relativeUrl) {
    return relativeUrl
            ? baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '')
            : baseUrl;
}

export function isAbsoluteURL(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

export function extend(a, b, thisArg) {
    forEach(b, (val, key) => {
        if (thisArg && typeof val === 'function') {
            a[key] = bind(val, thisArg);
        } else {
            a[key] = val;
        }
    });
    return a;
}
