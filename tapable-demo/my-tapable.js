/*
 * @Author: hucheng
 * @Date: 2019-08-11 14:38:04
 * @Description: here is des
 */

class Hook{
    constructor(args){
        this.taps = []
        this.interceptors = []
        this._args = args
    }
    tap(name,fn){
        this.taps.push({name,fn})
    }
}
class SyncHook extends Hook{
    
    call(name,fn){
        try {
            this.taps.map(tap => tap.fn(name))
            fn(name)
        } catch (error) {
            fn(error)
        }
        
    }
}
class SyncBailHook extends Hook{

}

module.exports = {
    SyncHook
}
