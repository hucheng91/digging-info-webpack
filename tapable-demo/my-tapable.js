/*
 * @Author: hucheng
 * @Date: 2019-08-11 14:38:04
 * @Description: here is des
 */

class Hook {
    constructor(args) {
        this.taps = []
        this.interceptors = []
        this._args = args
    }
    tap(name, fn) {
        this.taps.push({ name, fn })
    }
}
class SyncHook extends Hook {

    call(name, fn) {
        try {
            this.taps.map(tap => tap.fn(name))
            fn(null, name)
        } catch (error) {
            fn(error)
        }

    }
}
class SyncWaterfallHook extends Hook {
    call(name, fn) {
        try {
            let result = this.taps.reduce((result, tap) => tap.fn(name), null)
            fn(null, result)
        } catch (error) {
            fn(error)
        }
    }
}
class SyncBailHook extends Hook {
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
class SyncLoopHook extends Hook {
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

module.exports = {
    SyncHook, SyncWaterfallHook, SyncBailHook, SyncLoopHook
}
