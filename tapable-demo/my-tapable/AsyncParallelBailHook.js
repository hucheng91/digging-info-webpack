const Hook = require('./Hook')
module.exports =  class AsyncParallelBailHook extends Hook{
    callAsync(name, fn) {
       let remaining = this.taps.length;
      const callbackFn =  (error,result) =>{
            if(remaining <0) return;
            if(error){
                remaining = -1;
                return fn(error);
            }
            if(result ==undefined){return fn(result)}

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