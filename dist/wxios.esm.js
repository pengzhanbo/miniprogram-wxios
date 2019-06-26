function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function forEach(obj, fn) {
  if (obj === null || typeof obj === 'undefined') return;

  if (_typeof(obj) !== 'object') {
    obj = [obj];
  }

  if (Array.isArray(obj)) {
    obj.forEach(fn);
  } else {
    Object.keys(obj).forEach(function (key) {
      fn.call(null, obj[key], key, obj);
    });
  }
}
function bind(fn, thisArg) {
  return function () {
    for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
      arg[_key] = arguments[_key];
    }

    return fn.apply(thisArg, arg);
  };
}
function merge() {
  var result = {};

  function assign(val, key) {
    if (_typeof(result[key]) === 'object' && _typeof(val) === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    arg[_key2] = arguments[_key2];
  }

  arg.forEach(function (item) {
    forEach(item, assign);
  });
  return result;
}
function combURL(baseUrl, relativeUrl) {
  return relativeUrl ? baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '') : baseUrl;
}
function isAbsoluteURL(url) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
function extend(a, b, thisArg) {
  forEach(b, function (val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

var Interceptor =
/*#__PURE__*/
function () {
  function Interceptor() {
    _classCallCheck(this, Interceptor);

    this.handlers = [];
  }

  _createClass(Interceptor, [{
    key: "use",
    value: function use(fulfilled, rejected) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected
      });
      return this.handlers.length - 1;
    }
  }, {
    key: "eject",
    value: function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }
  }, {
    key: "forEach",
    value: function forEach(fn) {
      this.handlers.forEach(function (h) {
        if (h !== null) {
          fn(h);
        }
      });
    }
  }]);

  return Interceptor;
}();

function request(option) {
  if (typeof wx === 'undefined') {
    throw new Error('[miniProgram wxios] wx is not found!');
  }

  return new Promise(function (resolve, reject) {
    var timeout = option.timeout || 0;
    var timer;
    var isTimeout = false;
    var request = wx.request({
      url: option.url,
      data: option.data,
      header: option.headers,
      method: option.method.toUpperCase(),
      dataType: 'json',
      success: function success(response) {
        !isTimeout && resolve({
          response: response.data,
          headers: response.header,
          statusCode: response.statusCode
        });
        timer && clearTimeout(timer);
      },
      fail: function fail(res) {
        !isTimeout && reject(res);
        timer && clearTimeout(timer);
      },
      complete: function complete(res) {
        !isTimeout && typeof option.complete === 'function' && option.complete(res);
        timer && clearTimeout(timer);
      }
    });

    if (request && option.cancelToken) {
      option.cancelToken.promise.then(function (cancel) {
        request.abort && request.abort();
        reject(cancel);
        timer && clearTimeout(timer);
      });
    }

    if (timeout) {
      timer = setTimeout(function () {
        isTimeout = true;
        reject({
          response: {
            status: 408,
            message: "request timeout ".concat(timeout, "ms")
          },
          message: "request timeout ".concat(timeout, "ms")
        });
        request.abort && request.abort();
        clearTimeout(timer);
      }, timeout);
    }
  });
}

function dispatchRequest(config) {
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combURL(config.baseURL, config.url);
  } // 合并处理 headers


  config.headers = merge({}, config.headers.common || {}, config.headers[config.method] || {}, config.headers || {});
  forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function (method) {
    delete config.headers[method];
  });
  return request(config);
}

var Wxios =
/*#__PURE__*/
function () {
  function Wxios(config) {
    _classCallCheck(this, Wxios);

    this.defaults = config || {};
    this.interceptors = {
      request: new Interceptor(),
      response: new Interceptor()
    };
  }

  _createClass(Wxios, [{
    key: "request",
    value: function request(config) {
      if (typeof config === 'string') {
        config = Object.assign({
          url: arguments[0]
        }, arguments[1] || {});
      }

      config = merge({}, this.defaults, {
        method: 'get'
      }, config);
      config.method = config.method.toLowerCase();
      var chain = [dispatchRequest, undefined];
      var promise = Promise.resolve(config);
      this.interceptors.request.forEach(function (interceptor) {
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      this.interceptors.response.forEach(function (interceptor) {
        chain.push(interceptor.fulfilled, interceptor.rejected);
      });

      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }

      return promise;
    }
  }]);

  return Wxios;
}();

forEach(['delete', 'get', 'head', 'options', 'post', 'put', 'patch'], function (method) {
  Wxios.prototype[method] = function (url, data, config) {
    return this.request(Object.assign(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

var defaults = {
  timeout: 0,
  headers: {
    common: {}
  }
};
forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], function (method) {
  defaults.headers[method] = {};
});

var CancelToken = function CancelToken(executor) {
  _classCallCheck(this, CancelToken);

  if (typeof executor !== 'function') {
    throw new Error('executor must be a function!');
  }

  var resolvePromise;
  this.promise = new Promise(function (resolve, reject) {
    resolvePromise = resolve;
  });
  executor(function (cancel) {
    resolvePromise(cancel);
  });
};

CancelToken.source = function () {
  var cancel;
  var token = new CancelToken(function (c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

function createInstance(defaultConfig) {
  var context = new Wxios(defaultConfig);
  var instance = bind(Wxios.prototype.request, context);
  extend(instance, Wxios.prototype, context);
  extend(instance, context);
  return instance;
}

var wxios = createInstance(defaults);
wxios.Wxios = Wxios;

wxios.create = function create(instanceConfig) {
  return createInstance(Object.assign({}, defaults, instanceConfig || {}));
};

wxios.CancelToken = CancelToken;

wxios.all = function all(promises) {
  return Promise.all(promises);
};

export default wxios;
