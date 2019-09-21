const Hook = require('./Hook')
module.exports =  class SyncLoopHook extends Hook {
    call(name, fn) {
        try {
            this.taps.forEach(tap => {
                let result;
                do {
                    result = tap.fn(name)
                } while (result !== undefined);
            })
            fn(null)
        } catch (error) {
            fn(error)
        }
    }

}