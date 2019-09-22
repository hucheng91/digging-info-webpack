

const Hook = require('./Hook')
module.exports =  class AsyncSeriesWaterfallHook extends Hook {

    callAsync(name, fn) {
        let i = 0        
        let nextFn = (error,result) => {
            if(error){return fn(error)}
            i++
            this.taps[i].fn.apply(this,[result,nextFn])
        }
        this.taps[0].fn.apply(this,[name,nextFn])
    
    }
    callPromise(name,fn){
        
    }
} 