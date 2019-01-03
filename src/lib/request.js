export default function request(option) {
    if (typeof wx === 'undefined') {
        throw new Error('[miniProgram wxios] wx is not found!');
    }
    return new Promise((resolve, reject) => {
        let request = wx.request({
            url: option.url,
            data: option.data,
            header: option.headers,
            method: option.method.toUpperCase(),
            dataType: 'json',
            success: response => {
                resolve({
                    response: response.data,
                    headers: response.header,
                    statusCode: response.statusCode
                });
            },
            fail: res => {
                reject(res);
            },
            complete: res => {
                typeof option.complete === 'function' && option.complete(res);
            }
        });
        if (request && option.cancelToken) {
            option.cancelToken.promise.then(cancel => {
                request.abort && request.abort();
                reject(cancel);
            });
        }
    });
}
