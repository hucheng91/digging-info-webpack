
# Webpack的灵魂强大的事件流Tapable下-- 异步 hook

![tapable.png-774.3kB][1]

同步的实现比较简单，但同步是满足不了我们很多业务场景，比方你需要你在某个 事件流程了需要有个后端接口请求，根据这种异步返回的结果决定下一个动作，实际上我们在真实的业务场景里，异步请求更多


## AsyncSeries 异步串行
异步串行的意思是，需要执行一个 function 数组，这些
function 是有顺序的，现在某个方法里有 异步请求，下个 fn 需要等到 这个异步请求完成才执行下一个 fn ,来个具体例子

```javascript
 const {
	AsyncSeriesHook
 } = require("../my-tapable");

 const hook = new AsyncSeriesHook(['name']);
 hook.tap('1',(name,callback) => {
     setTimeout(() => {
        console.log('Hello',name);
        callback()
     },1000)
    
 })
 hook.tap('2',(name,callback) => {
    setTimeout( () => {
        console.log('Wellocome',name);
        callback(null)
    },2000)
    
 })

hook.tap('3',(name,callback) => {
    console.log('Happy',name);
    callback()
})

hook.callAsync('chromedev',function(){
    console.log('finish',...arguments)
});
```
期待结果输出：
```
Hello hucheng
Wellocome hucheng
Happy hucheng
finish
```
可以看到我们需要的是 在 setTimeout 这种异步方法 执行回调，哪这个怎么实现的？，写个简单的代码实现，大家看下
```
class AsyncSeriesHook  {
    constructor(args) {
        this.taps = []
    }
    tap(name, fn) {
        this.taps.push({ name, fn })
    }
    // 仔细看代码的实现，这就是 JavaScript 的魅力所在
    callAsync(name, fn) {
        let i = 0        
        let nextFn = (error) => {
            if(error){return fn(error)}
            i++
            if(i >= this.taps.length){return fn()}
            this.taps[i].fn.apply(this,[name,nextFn])
           // 注意看这里，上面的nexFn，就放到了 调用的地方了  
         
        }
        this.taps[0].fn.apply(this,[name,nextFn])
    }
    /**
    * hook.tapAsync('1',(name,callback) => {
        setTimeout(() => {
            console.log('Hello',name);
            callback()
        },1000)
        
    })
    */
} 
```

## AsyncParallel 异步并行
**异步并行的意思是，需要执行一个 function 数组，这些
function 并行执行，相互不影响，在 所有的 function 执行完成后，调用 callback， 也是一个常见的场景**
```javascript
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
```
AsyncSeriesBailHook，AsyncSeriesWaterfallHokk，AsyncParallerBailHook 实现就都比较简单了，这里就不列举了，具体可以看 我 github 代码实现

# 总结
用2篇 梳理了 Tapable 的代码实现，Webpack 源码里面有各种 Tapable 提供的 hook 使用，实际上Tapable 是典型的事件流，而事件流基本是前端在处理复杂业务必须用到，这样才能让代码解藕，非常值得大家去好好的学习它，这还是单个的同步，异步 hook， 那把二者结合起来，功能更加强大，下篇就看看那 webpack resolve 模块是怎么灵活结合使用这 2 种 hook 的

本文原创发布于 同名微信公众号 「chromedev」，给个赞呗。 

![公众号 chromedev ]](http://static.zybuluo.com/chromede v91/99oeoytq6nxe6j89u1jsrfvk/0.jpeg)

[1]: http://static.zybuluo.com/hucheng91/9rlar0z7949fdtlco3znqj09/tapable.png

