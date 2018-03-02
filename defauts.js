var utils = require('./utils.js');

var defaults = {
    timeout: 0,
    headers: {
        common: {}
    }
};
utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], method => {
    defaults.headers[method] = {};
});

module.exports = defaults;
