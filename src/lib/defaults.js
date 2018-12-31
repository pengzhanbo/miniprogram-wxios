import {forEach} from './utils';

var defaults = {
    timeout: 0,
    headers: {
        common: {}
    }
};
forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], method => {
    defaults.headers[method] = {};
});

export default defaults;
