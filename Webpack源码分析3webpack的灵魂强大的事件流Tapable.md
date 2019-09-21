<!--
 * @Author: hucheng
 * @Date: 2019-08-27 19:32:33
 * @Description: here is des
 -->
# Webpack的灵魂强大的事件流Tapable

标签（空格分隔）： Webpack

---

# Webpack源码分析(3)--之 Webpack的灵魂强大的事件流Tapable(I)--同步 hook

本来这篇是要说 resolve 实现的，但我发现讲 resolve 之前不把 Tapable 讲清楚，是搞不明白，这篇是最重要的，其他可以跳过，这个希望正在看的读者，仔细看看，搞明白了

## 生命周期的概念

先拉远些，我们看三大框架，都有个生命周期的概念，在生命周期暴露些hook，生命周期说白了就是对一个流程的抽象，就像一个小河里的水流，经过一个个大坝，规定有的大坝处理下垃圾，有的来个分流到小河里灌溉，有的来防洪，哪个大坝可以捕鱼，定义好每个大坝要干的事，那周围的人就知道自己干什么事的时候，到哪个大坝去就好了

当你在写一个复杂的逻辑的，特别是暴露给很多人用的库时，一定要先抽象出个生命周期的流程出来，会方便很多，扩展也容易很多(我在这方面就不足，经常一顿乱写，每次升级别人依赖我的东西时候，都得手动去改代码，灵活性不足，正在慢慢学习使用这个思维)

## 事件流的概念

 注意哈，这里的`事件`不是单纯的指 dom元素的事件,指的是程序的逻辑的关系，nodejs 有个 EventEmitter ，EventEmitter 的核心函数有两个，向事件集合中添加函数的event.on()以及用于触发的函数event.emit()。这个本质上是个发布订阅，先列几个常见的业务场景

- 你在写一套通用的cli的时候，每个bu，小组有不同模版要求，有的需要先创建远程git仓库，有的需要打包后发布到 cdn 等定制化需求，你怎么样做到可插拔，而不是一坨坨 if else
- 商品组件加入购物车后，需要触发 头部购物车数字状态改变，购物车金额数字改变，优惠券组件展示，左侧其他商品组件初始化,这些触发相互不影响的
- step by step,新功能引导流程， 组件间状态不依赖
- 复杂些的审批流程，下一个组件的状态依赖上一个组件的返回值数据
- 你需要写一个移动端用户认证的服务，这个服务总共分为2部分，资料审核上传，审核通过后展示信息，但是，游戏BU的资料审核只需要上传个身份证图片，信贷 BU 的要经历摄像头拍照，眨眼睛，说话，小说 BU 和在信贷 BU 的基础上还多了游戏部门的身份证环节

上面是一些具体的业务场景，读者可以先想想这些你遇到了会怎么解决

我们回到Webpack，Webpack 扩展了 EventEmitter ，把所有的逻辑抽象成各种 plugins ,要 打包 TypeScipt，加个对应的 loader，这些loader都是对应的 plugin，然后挂载上去，需要 处理编译后的文件，自定义个 `new Plugin` 来挂载，上面说的几个业务场景，Webpack 构建过程中都有遇到，而且比上面复杂的多流程都有，那我们理解了 Webpack 实现思想，在去处理 我们工作中遇到的具体业务逻辑，就非常方便了，这也是网上说的，多看源码，理解源码，为自己所用的原因

事件流最大的好处就是代码耦合性小，把逻辑独立到个个子模块，可插拔

Webpack 80%的代码都是通过 plugins 的方式挂载的，外带第三方 plugins，loader，同时通过 一样挂载，我数了下 Webpack文档，compiler暴露了 24 个 hook，compilation 暴露了 65 个 hook ，要把这么复杂的打包流程组装起来，webpack 就是基于事件流开发了一个独立的骨架，这个骨架就是 Tapable，Tapable就是Webpack的大脑

总于说到Tapable了，下面就具体看下 Tapable 把事件流定义了那几个类型，Tapable的讲解，分为3部分

- 同步事件流
- 异步事件流
- 组合事件流


![tapable.png-774.3kB][1]

先说说最简单的 sync 实现

## SyncHook

SyncHook的特点是，每个注入的方法不关注返回值，同步的串行的执行每个方法

 看段具体代码
```javascript
const { SyncHook } = require("tapable");
class MyVue {
    constructor() {
        this.hooks = {
            beforeCreate: new SyncHook(["beforeCreateHook"]),
            created: new SyncHook(["createdHook"]),
            mounted: new SyncHook(),
            destroyed: new SyncHook(),
        };
    }
    defaultBeforeCreateHook(){
        this.hooks.beforeCreate.tap('1', (name) => {
        console.log('default', name);
        })
    }
    beforeCreate() {
        console.log('准备初始化MyVue实例了')
        //....这里框架干了一堆事 ，就通过 hook 把使用者注入代码执行完成了
        this.hooks.beforeCreate.call('MyVue')
    }
    created() {
        console.log('干点其他事,唤起hook created ')
        this.hooks.created.call(this)
    }
    init() {
        //..... 干一堆事
        this.beforeCreate()
        //..... 再干一堆事
        this.created()
    }
}
const vueInstance = new MyVue()
vueInstance.hooks.beforeCreate.tap('1', (name) => {
    console.log('hello', name);
})
vueInstance.hooks.beforeCreate.tap('2', (name) => {
    console.log('Wellocome', name);
})
vueInstance.init()

输出如下：
准备初始化MyVue实例了
hello MyVue
Wellocome MyVue
干点其他事,唤起hook created 
```
这里模仿 Vue 定义了几个生命周期，这样是不是就把代码解藕了，在自己项目中就可以通过这种方式，把外部传入的逻辑和自己框架的逻辑剥离出来, `defaultBeforeCreateHook` 方法就可以做到可插拔，在你框架逻辑变化的时候，就改变 default* 这个方法就好
我们平常有写 Webpack 插件的话，都是这种方式挂载上去的

SyncHook 的特点是，每个注入的方法不关注上个方法返回值，同步的串行的执行每个方法,下面简单实现 SyncHook

```javascript
class Hook{
    constructor(args){
        this.taps = []
        this.interceptors = [] // 这个放在后面用
        this._args = args 
    }
    tap(name,fn){
        this.taps.push({name,fn})
    }
}
class SyncHook extends Hook{
    call(name,fn){
        try {
            this.taps.forEach(tap => tap.fn(name))
            fn(null,name)
        } catch (error) {
            fn(error)
        }
        
    }
}
```
看到 `this.taps.forEach(tap => tap.fn(name))`,这里不关注上个方法返回值

## SyncWaterfallHook

SyncWaterfallHook 和 SyncHook 的差别是 SyncWaterfallHook 注入的方法，上一个方法的返回值会做为下个方法的参数传入,这个和我们最上面说的那个业务场景
> 复杂些的审批流程，下一个组件的状态依赖上一个组件的返回值数据

是不是就很合适的套上了，SyncWaterfallHook 实现如下
```javascript
class SyncWaterfallHook extends Hook{
    call(name,fn){
        try {
           let result =  this.taps.reduce((result,tap) => tap.fn(name),null)
            fn(null,result)
        } catch (error) {
            fn(error)
        }
        
    }
}
```
## SyncBailHook
假设有一方法返回非 `undefined`,跳过剩下的 tap，立即执行回调，实现如下
```javascript
class SyncBailHook extends Hook{
    call(name,fn){
        try {
            let result = this.taps.reduce((result,tap) => {
                if(result != undefined){
                    fn(null,result)
                }else{
                    return  tap.fn(name)
                }
            },null)
             fn(null,result)
        } catch (error) {
            fn(error)
        }
    }
}
```

这个Hook比较适合在 满足某些条件的情况下，执行某个逻辑，而这些条件是当下不能确定的，需要使用者来定义，传入框架的，说的有点绕，我不知道怎么去描述这个场景，可以简单的想成，多条件判断，只要一个返回 true，就执行具体逻辑

## SyncLoopHook

如果当前方法返回 非`undefined`，一直执行这个方法，只有当返回 `undefined` 跳出循环，执行下一个方法，这个我目前没有想到使用场景，实现方式如下

```javascript
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
```
同步 hook 写完，理解学会这几种用法，在平常工作中可以大大的减少代码耦合，值得深入理解学习
下篇我们讲下异步Hook

本文原创发布于 同名微信公众号 「chromedev」，给个赞呗。 

![](http://static.zybuluo.com/hucheng91/99oeoytq6nxe6j89u1jsrfvk/0.jpeg)

[1]: http://static.zybuluo.com/hucheng91/9rlar0z7949fdtlco3znqj09/tapable.png