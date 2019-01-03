## wxios 接口请求
针对 wx.request 接口进行二次封装。

1. 使用`promise`调用风格
2. 加入 拦截器功能

### API

1. `wxios(config)`
    ``` javascript
    wxios({
        url: 'http://localhost/api',
        method: 'post',
        data: {
            test: '1'
        }
    }).then(function (response) {
        console.log(response);
    });
    ```

2. `wxios(url[, config])`
    ``` javascript
    wxios(
        'http://localhost/api',
        {
            method: 'post',
            data: {
                test: '1'
            }
        }
    ).then(function (response) {
        console.log(response);
    });
    ```

3. 请求 别名

    1. `wxios.request(config)`
    2. `wxios.get(url, data[, config])`
    3. `wxios.post(url, data[, config])`
    4. `wxios.delete(url, data[, config])`
    5. `wxios.head(url, data[, config])`
    6. `wxios.put(url, data[, config])`

4. `wxios.all(promises)`
    ``` javascript
    var p1 = Promise.resolve();
    var p2 = Promise.resolve();
    wxios.all([p1, p2])
        .then(function(resList){
            console.log(resList);
        });
    ```

5. `wxios.create([defaultConfig])`

    通过 `wxios.create([defaultConfig])` 创建一个全新的 wxios实例。
    ```javascript
    var instance = wxios.create({
        baseURL: 'http://localhost'
    });
    ```
    新实例拥有 wxios下挂载的所有request方法。

6. 请求拦截器

    _request拦截器_ : `wxios.interceptors.request`

    ``` javascript
    // 添加一个拦截器
    // 同时返回一个 拦截器标识
    var interceptorId = wxios.interceptors.request.use(function(config) {
        // do something...
        // TODO:
        // 每个拦截器都必须返回 config
        return config;
    });
    // 删除一个拦截器
    wxios.interceptors.request.eject(interceptorId);
    ```

    _response拦截器_ : `wxios.interceptors.response`
    ``` javascript
    // 添加一个拦截器
    // 同时返回一个 拦截器标识
    var interceptorId = wxios.interceptors.response.use(function(response) {
        // do something...
        // TODO:
        // 每个拦截器都必须返回 response
        return response;
    });
    // 删除一个拦截器
    wxios.interceptors.response.eject(interceptorId);
    ```

7. Default Config

    ``` javascript
    {
        // 公共接口前缀
        baseURL: '',
        // 公共 headers 配置
        headers: {},
    }
    ```

    ``` javascript
    wxios.defaults.baseURL = 'http://localhost';
    wxios.defaults.headers.common['content-type'] = 'application/json';
    wxios.default.headers.post['content-type'] = 'application/json';
    ```

8. 取消请求

    `wxios.CancelToken`
    ``` js
    var cancelToken = wxios.CancelToken.source();
    wxios.post('/test', {}, {
        cancelToken: cancelToken.token
    });
    
    // cancel
    cancelToken.cancel(errorMessage);
    ```
