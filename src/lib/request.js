export default function request(option) {
    if (typeof wx === 'undefined') {
        throw new Error('[miniProgram wxios] wx is not found!');
    }
    return new Promise((resolve, reject) => {
        const timeout = option.timeout || 0;
        let timer;
        let isTimeout = false;
        let request = wx.request({
            url: option.url,
            data: option.data,
            header: option.headers,
            method: option.method.toUpperCase(),
            dataType: 'json',
            success: response => {
                !isTimeout && resolve({
                    response: response.data,
                    headers: response.header,
                    statusCode: response.statusCode
                });
                timer && clearTimeout(timer);
            },
            fail: res => {
                !isTimeout && reject(res);
                timer && clearTimeout(timer);
            },
            complete: res => {
                !isTimeout && typeof option.complete === 'function' && option.complete(res);
                timer && clearTimeout(timer);
            }
        });
        if (request && option.cancelToken) {
            option.cancelToken.promise.then(cancel => {
                request.abort && request.abort();
                reject(cancel);
                timer && clearTimeout(timer);
            });
        }
        if (timeout) {
            timer = setTimeout(() => {
                isTimeout = true;
                reject({
                    response: {
                        status: 408,
                        message: `request timeout ${timeout}ms`
                    },
                    message: `request timeout ${timeout}ms`
                });
                request.abort && request.abort();
                clearTimeout(timer);
            }, timeout);
        }
    });
}
