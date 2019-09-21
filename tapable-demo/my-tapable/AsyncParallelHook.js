const Hook = require('./Hook')
module.exports =  class AsyncParallelHook extends Hook{
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