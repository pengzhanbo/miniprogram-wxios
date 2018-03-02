/**
 * Interceptor
 */
function InterceptorManger() {
    this.handlers = [];
}

/**
 * 新增拦截器到堆栈中
 * @param {Function} fulfilled
 * @param {Function} rejected
 * @return {Number}
 */
InterceptorManger.prototype.use = function use(fulfilled, rejected) {
    this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected
    });
    return this.handlers.length - 1;
};

/**
 * 通过 ID 删除拦截器
 * @param {Numer} id
 */
InterceptorManger.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
        this.handlers[id] = null;
    }
};

/**
 * @param {Function} fn
 */
InterceptorManger.prototype.forEach = function forEach(fn) {
    this.handlers.forEach(h => {
        if (h !== null) {
            fn(h);
        }
    });
};

module.exports = InterceptorManger;
