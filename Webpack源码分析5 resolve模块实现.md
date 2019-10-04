
# resolve 模块代码实现

resolve 模块是 webpack 里非常重要的一个模块,专门处理各种路径资源，举个例子
```
// webpack.config.js
exports = {
    resolve: {
        alias: {'@': path.resolve(__dirname, 'src')}
    }
}
import "/home/me/file"
import "C:\\Users\\me\\file"
import util from './util'
import vue from 'vue'
const a = require('./test')
const b = require('b')
const c = require('@/util')
import data ‘./a.json’
console.log(454
``` 

resove 模块的功能就是根据标记的路径返回资源的绝对路径，然后交给其他模块处理，webpack 团队 独立出来一个 lib 来负责解析，npm 包的名字叫 `enhanced-resolve`，
那是怎么实现的，来理一理,我也来实现一个简单的 resolve 模块

`enhanced-resolve` 拿到 资源标记，放到一个 content 对象里，之后就是将 content 对象做为上下文，操作这个 content 对象直到返回

首先会判断是不是绝对路径的资源，是的话，就直接返回路径，然后判断是不是相对路径，然后判断是不是有配置  `alias` 别名，有没有配置 `mainFields`,有没有配置 `mainFiles`,`mainFiles`,`extensions`,大家可以看下 webpack 官网 resolve 模块的参数，非常多，`enhanced-resolve` 需要根据各种参数来解析

`enhanced-resolve` 把整个过程分为几个大的节点，每个节点有有很多对应的 plugins 来处理，每个 plugin 的构造函数有 source，taget 2个参数，source 标记 对应的 hook，target 标记执行接下来执行哪个 hook,截段代码

```
class Resolver {
	constructor(fileSystem) {
		this.fileSystem = fileSystem;
		this.hooks = {
			resolveStep: new SyncHook(["hook", "request"], "resolveStep"),
			noResolve: new SyncHook(["request", "error"], "noResolve"),
			resolve: new AsyncSeriesBailHook(
				["request", "resolveContext"],
				"resolve"
			),
			result: new AsyncSeriesHook(["result", "resolveContext"], "result")
            "parsedResolve":xxxHook
            "describedResolve":xxxHook
            "rawModule":xxxHook
            "module":xxxHook
            "resolveInDirectory":xxxHook
            "resolveInExistingDirectory":xxxHook
            "relative":xxxHook
            "describedRelative":xxxHook
            "directory":xxxHook
            "undescribedExistingDirectory":xxxHook
            "existingDirectory":xxxHook
            "undescribedRawFile":xxxHook
            "rawFile":xxxHook
            "file":xxxHook
            "existingFile":xxxHook
            "resolved":xxxHook
            }
```
这些 Hook 就是 Tapable 的具体使用场景了，就跟 vue 的生命周期一样，resolve 也是把整个流程（或者叫生命周期）分为些节点 ，在 Tabable 里我们讲过 每个hook 都可以 tap(name,function(){}),在resolve 里我们就可以 tap 很多个plugin，这样 就把整个流程联系起来了，




本文原创发布于 同名微信公众号 「chromedev」，给个赞呗。 

![公众号 chromedev ]](http://static.zybuluo.com/chromede v91/99oeoytq6nxe6j89u1jsrfvk/0.jpeg)


