/**
 * 小程序 wx.request 接口简单封装，支持promise；
 */
module.exports = function wxRequest(config) {
    if (typeof wx === 'undefined') {
        throw new Error('wx is not found!');
    }
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.url,
            data: config.data,
            header: config.headers,
            method: config.method.toUpperCase(),
            dataType: 'json',
            success: (response) => {
                resolve({
                    response: response.data,
                    headers: response.header,
                    statusCode: response.statusCode
                });
            },
            fail: res => {
                reject(res);
            },
            complete: () => {
                typeof config.complete === 'function' && config.complete();
            }
        });
    });
};
