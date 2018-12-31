export default function request(option) {
    if (typeof wx === 'undefined') {
        throw new Error('[miniProgram wxios] wx is not found!');
    }
    return new Promise((resolve, reject) => {
        wx.request({
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
    });
}
