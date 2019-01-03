class CancelToken{
    constructor(executor){
        if (typeof executor !== 'function') {
            throw new Error('executor must be a function!');
        }
        let resolvePromise;
        this.promise = new Promise((resolve, reject) => {
            resolvePromise = resolve;
        });
        executor(cancel => {
            resolvePromise(cancel);
        });
    }
}

CancelToken.source = function () {
    let cancel;
    var token = new CancelToken(c => {
        cancel = c;
    });
    return {token, cancel};
};

export default CancelToken;
