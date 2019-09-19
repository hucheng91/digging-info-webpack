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
    tapAsync(name,fn){

    }
    call(name, fn) {

    }
    callAsync(name, fn) {

    }
    callPromise(name,fn){

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

class AsyncSeriesHook extends Hook {

    // 仔细看代码的实现，这就是 JavaScript 的魅力所在
    callAsync(name, fn) {
        let i = 0        
        let nextFn = (error) => {
            if(error){return fn(error)}
            i++
            if(i >= this.taps.length){return fn()}
            this.taps[i].fn.apply(this,[name,nextFn])
           // 注意看这里，上面的nexFn，就放到了 调用的地方了  
          /**
           * hook.tapAsync('1',(name,callback) => {
                setTimeout(() => {
                   console.log('Hello',name);
                   callback()
                },1000)
               
            })
            */
        }
        this.taps[0].fn.apply(this,[name,nextFn])
    
    }
    callPromise(name,fn){
        
    }
} 
class AsyncParallelHook extends Hook{
    callAsync(name, fn) {
       let remaining = this.taps.length;
      const callbackFn =  (error) =>{
            if(remaining <0) return;
            if(error){
                remaining = -1;
                return fn(error);
            }
            remaining--;
            if(remaining == 0){
                return fn()
            }
       }
       for(var i = 0; i < this.taps.length; i++) {
        this.taps[i].fn.apply(this, [name,callbackFn]);
       } 
    }
}
module.exports = {
    SyncHook,
    SyncWaterfallHook,
    SyncBailHook,
    SyncLoopHook,
    AsyncSeriesHook,
    AsyncParallelHook
}
