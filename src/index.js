import {
    bind,
    extend
} from './lib/utils';
import Wxios from './lib/Wxios';
import defaults from './lib/defaults';
import CancelToken from './lib/cancel';

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
