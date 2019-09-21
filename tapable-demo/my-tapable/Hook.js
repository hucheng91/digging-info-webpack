module.exports = class Hook {
    constructor(args) {
        this.taps = []
        this.interceptors = []
        this._args = args
    }
    tap(name, fn) {
        this.taps.push({ name, fn })
    }
    tapAsync(name,fn){

    }
    call(name, fn) {

    }
    callAsync(name, fn) {

    }
    callPromise(name,fn){

    }
}