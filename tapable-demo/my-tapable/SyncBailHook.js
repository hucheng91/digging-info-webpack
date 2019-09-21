const Hook = require('./Hook')
module.exports =  class SyncBailHook extends Hook {
    call(name, fn) {
        try {
            let result = this.taps.reduce((result, tap) => {
                if (result != undefined) {
                    fn(null, result)
                } else {
                    return tap.fn(name)
                }
            }, null)
            fn(null, result)
        } catch (error) {
            fn(error)
        }
    }
}