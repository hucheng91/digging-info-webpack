

const Hook = require('./Hook')
module.exports =  class AsyncSeriesBailHook extends Hook {

    // 仔细看代码的实现，这就是 JavaScript 的魅力所在
    callAsync(name, fn) {
        let i = 0        
        let nextFn = (error,result) => {
            if(error){return fn(error)}
            i++
            if(i >= this.taps.length || result ==undefined){return fn(result)}
            this.taps[i].fn.apply(this,[result,nextFn])
        }
        this.taps[0].fn.apply(this,[name,nextFn])
    
    }
    callPromise(name,fn){
        
    }
} 