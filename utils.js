function forEach(obj, fn) {
    if (obj === null || typeof obj === 'undefined') {
        return;
    }

    if (typeof obj !== 'object') {
        obj = [obj];
    }
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        for (var i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
        }
    } else {
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                fn.call(null, obj[key], key, obj);
            }
        }
    }
}

function bind(fn, thisArg) {
    return function () {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
    };
}

function merge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
        if (typeof result[key] === 'object' && typeof val === 'object') {
            result[key] = merge(result[key], val);
        } else {
            result[key] = val;
        }
    }
    for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
    }
    return result;
}

module.exports = {
    bind: bind,
    forEach: forEach,
    merge: merge,
    // 合并URL
    combURL: function (baseURL, relativeURL) {
        return relativeURL
            ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
            : baseURL;
    },
    // 判断是否是绝对URL
    isAbsoluteURL: function (url) {
        return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    },
    extend: function (a, b, thisArg) {
        forEach(b, function (val, key) {
            if (thisArg && typeof val === 'function') {
                a[key] = bind(val, thisArg);
            } else {
                a[key] = val;
            }
        });
        return a;
    }
};
