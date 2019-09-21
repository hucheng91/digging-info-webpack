const Hook = require('./Hook')
module.exports =  class AsyncSeriesHook extends Hook {

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