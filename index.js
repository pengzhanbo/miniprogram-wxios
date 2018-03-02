var utils = require('./utils');
var Wxios = require('./Wxios');
var defaults = require('./defauts');

function createInstance(defaultConfig) {
    var context = new Wxios(defaultConfig);
    var instance = utils.bind(Wxios.prototype.request, context);
    utils.extend(instance, Wxios.prototype, context);
    utils.extend(instance, context);
    return instance;
}

var wxios = createInstance(defaults);

wxios.Wxios = Wxios;

/**
 * 新建 Wxios 实例
 * @param {Object} instanceConfig
 */
wxios.create = function create(instanceConfig) {
    return createInstance(Object.assign({}, defaults, instanceConfig || {}));
};

wxios.all = function all(promises) {
    return Promise.all(promises);
};

module.exports = wxios;
