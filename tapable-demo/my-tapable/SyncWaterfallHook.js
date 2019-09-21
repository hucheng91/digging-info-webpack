
const Hook = require('./Hook')
module.exports = class SyncWaterfallHook extends Hook {
    call(name, fn) {
        try {
            let result = this.taps.reduce((result, tap) => tap.fn(name), null)
            fn(null, result)
        } catch (error) {
            fn(error)
        }
    }
}