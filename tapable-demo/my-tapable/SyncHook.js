
const Hook = require('./Hook')
module.exports =  class SyncHook extends Hook {

    call(name, fn) {
        try {
            this.taps.map(tap => tap.fn(name))
            fn(null, name)
        } catch (error) {
            fn(error)
        }

    }
}