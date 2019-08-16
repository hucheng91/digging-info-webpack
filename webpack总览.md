
# Webpack源码分析(1)--之 流程总览
## Webpack 架构梳理

最近花时间把 Webpack 的源码撸了撸，很有收获，记录下来

Webpack 绝对是前端划时代的产物，它的周围生态非常丰富，社区产出了各种 plugins，loaders，这也说明了
Webpack 的架构非常灵活，既然它的架构这么厉害，就值得我们学习，
有的人说 现在浏览器已经在支持 es module 的形式了，未来webpack会淘汰的，不应该把时间花在这个上面，实际上是不可能的

![webpack-browser.png-2809.2kB][1]

如上图，复杂的应用，模块之间的依赖是非常复杂的，还有循环依赖，浏览在在加载的同时，还要去解决这些问题，这些要在几微秒完成，基本是不可能的
除非在硬件层面有质的提升，所以还是花心思研究下还是有必要的，不要局限在完成下 webpack.config.js ,知其然知其所以然

Webpack 的整个骨架是基于[Tapable](https://github.com/webpack/tapable),Tapable 是 Eventemitter 的升级版本，它包含了 同步/异步 发布订阅模型，
异步模型里有区分了串行和并行，这也是 我们经常在 config.js里看到
```
{
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
```
这种组合 loaders比作河流上的大坝的话，css文件像水流一样经过各个大坝， 处理起来， 各个 loader 互不影响，最后变成我们想要的文件，这底层就是依赖了灵活的 Tapable
还有我们写的 各种 插件 `hook.some.call(pluginName,fn)`都是依赖 Tapabel 所以会花很大的篇幅讲 Tapable，把Tapable弄熟，我们平常再复杂的项目也可以用 Tapable来架构项目

接下来 Webpack里的几个概着重讲一下

![com.png-416.8kB][2]
## Compiler 
这个可以看成 Webpack 的实例，整个编译流程都是挂载这个对象上，它整个生命周期里暴露了很多方法，常见的 run,make,compile,finish,seal,emit等，我们写的插件就是作用在这些暴露方法的hook上

## Compilation
 Compiler 是控制从输入命令到完成输出的这整个生命周期，Compilation是把所有处理成 modules 的过程，所以一个 Compiler周期内会反复触发 Compilation 实例
 
 
![mudulefac.png-469.4kB][3] 
## Modules

一个文件就是一个module，比方如下
```javascript
 //index.js
 import es6Module from './es6'
 import './style.css'
 console.log(1223)
 es6Module()

 // es6.js
 function es6Module() {
    console.log('this is es6 module')
}
export default es6Module

```
这里就会出现 3个 module ，`index.js,es6.js,stype.css`,那webpack 只 build js文件，所有 style.css 会先转换成 js，
然后参与编译，**所以这也就是网上说的 Webpack里 所有都是 module 的原因**

Webpack 最开始是加载 我们的entry 入口文件，然后通过 acorn( babel 的解析引擎是 Babylon) 转换成AST，这个过程叫 Parser 上面一段代码转换如下(你可以打开 astexplorer.net，贴下代码看看)

![ast.png-690.9kB][4]

通过图可以看到，3行代码对应的AST如上图，那我们分析下，看右边的 body 的，三行代码对应着不同类型，有 ImportDeclaration,ExpressionStatement,那通过这个 Webpack 是不是就可以识别行代码是执行js，还是引入js， 然后遍历这个ast节点树，根据不同的类型，做不同的动作，比方看到是 `import es6Module from './es6' `,那就去加载`es6.js`,转换成 ast，把`es6.js`放到 modules 数组里，然后遍历`./es6` 接着按照上面的动作在迭代，把所有的文件都放入到modules里存起来,常见的 module 有`RawModule,NormalModule,MultiModule,ContextModule,DllModule`,决定用那个Modul来加载处理，是ModuleFactory来决定的,最长用的是 `NormalModule`

![parse.png-378.7kB][5]
## Loaders
那图片这种资源类型，首先需要经过处理下，这个行为就是loader完成的，不同的资源，对应不同的loader,这也是 loader的功能是把资源转换成 js文件的说法的原因

## dependencys
那接着往下走，经过AST处理后的文件，假设有的是用的 import，amd，json，是不是都需要对应的代码逻辑处理，Webpack 把这个抽象成了 dependencys,每个 module 都有不同的 dependencys，modules总于组装完成了,常见的有`AMDRequireDependency,AMDDefineDependency,AMDRequireArrayDependency,`
`CommonJsRequireDependency,SystemImportDependency`

![teplate.png-602.8kB][6]
## chunk，template
接下来，总于要开始组装，优化这些 modules了，这个时候就出现了 chunk的概念，根据规则把 modules 合并，优化，所以会说 chunk 是由一些 modules 组成的，接下来`_webpack_require_ `该出场了吧，`_webpack_require_ `替换 `require`,这个叫模版替换，有 `ModuleTemplate,MainTemplate,ChunkTemplate,HotUpdateChunkTemplate`,这些 模版 都有一个 `render` 方法

最后通过 emitAssets 输出到 output 目录，完成真个过程

这就是整个过程了。


下面是我画的一个流程图

![image.png-1174.3kB][7]


这个图是在网上看到的,也挺好的

![image.png-296.8kB][8]


  [1]: http://static.zybuluo.com/hucheng91/izo4ix5nm7m7ckengpdxpqn0/webpack-browser.png
  [2]: http://static.zybuluo.com/hucheng91/8xlfd1nnlvtlkomicr60umcx/com.png
  [3]: http://static.zybuluo.com/hucheng91/p2d41npzm92ev8fe5yxb9975/mudulefac.png
  [4]: http://static.zybuluo.com/hucheng91/m5ue5sl113fy1qlh9j95e2w9/ast.png
  [5]: http://static.zybuluo.com/hucheng91/vfb53fnl01h4qk5m74pizdyp/parse.png
  [6]: http://static.zybuluo.com/hucheng91/gzqvzoyhxqcwhddfrlwkfxm3/teplate.png
  [7]: http://static.zybuluo.com/hucheng91/m3ez5c9ptntj8xj944ofq7hh/image.png
  [8]: http://static.zybuluo.com/hucheng91/0ueioqim2ned1zfmzrl9qt8n/image.png