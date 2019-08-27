<!--
 * @Author: hucheng
 * @Date: 2019-08-25 22:06:55
 * @Description: here is des
 -->

# Webpack源码分析(2)--之 先了解下什么是AST

## 站在Webpack的角度理解下我们写的代码

先抛个问题，JavaScript 是一门编译型语言还是解释型语言？

```
const module1 = require('module1')
import modul2 from 'module2' 
const result = 123
```
我们在项目会写很多这种依赖引入，那 Webpack 获取这段代码的时候，它应该怎么去识别它？有的同学就大腿一拍，这还不简单，用正则来判断下不就好，简单的肯定可以，但是复杂，大段替换，单单正则是搞不定的，那们想想，大学有一门课叫 编译原理，把高级语言编译成机器能识别的，编译最开始就是 扫描你的代码，抽象成一颗语法树，然后进行词法分析,那这个树就叫 抽象语法树，简称AST，Babel 把 `const` 专换成 `var` 就是利用 这个特性， 把代码转换成 AST，然后处理这颗 AST 树，处理完成，然后又生成 code，同样 Webpack 处理 `require,import` 依赖，也是在遍历 AST 树， 今天我们就聊下 AST

现代前端是离不开AST，我们用到的`React,Vue,Angular,小程序`，这些框架本质上最后都是转换成被浏览器能识别的 JavaScript 代码,它们都可以理解成一种 DSL ，你会了你可以写一个自己的框架，比方叫`avr`,语法来个三不像，也很好晚，流行的 `mpvue,taro,react-netive`,都是在处理 AST,专换成你需要的代码，所以掌握AST非常重要，AST这一层大部分是框架处理，一般开发接触不到，导致很多人对AST都很陌生，这篇的目的是让大家大概了解下 AST,不会深入去写AST，对AST感兴趣的可以关注我下，后面我会写个三不像的`avr`框架，详细介绍 AST

![ast.png-23.8kB][1]
(网上找的图)

先来个最简单的语法，我们把 `const test = 123` 转换成 `var test = 123`,看代码
```
const acron = require('acorn')
const traverse = require("ast-traverse");
const escodegen = require('escodegen')
const code = `const test = 123`
let ast = acron.parse(code)

traverse(ast, {
    pre: function (node, parent, prop, idx) {
        if (node.kind == 'const') {
            node.kind = 'var'
        }
    }
})
let esCode = escodegen.generate(ast)
console.log(esCode)
```

`let ast = acron.parse(code)` 会把代码转换成 一个tree的数据类型，tree的截图如下

![astcode.png-74.5kB][2]

大家可以看到 ast 其实就是对代码文本的一种抽象，通过 type来标记，我们要做的是 就是遍历这颗 tree，把 `const ` 替换成 `let`,就好了，然后在把 ast 转换成 code，代码非常简单,可以自己跑一下

ast 语法简单的介绍下，网上又很多的详细的介绍，
各个框架都提供了一个 对应的 `*.loader`插件，这些loader 就是把框架的DSL转换成 JavaScript，Eslint，postcss，这些都是用的AST，我们脑洞开一下，有了 AST 我们是不是可以把 React，Vue 相互转换，定义自己公司独有的语法，折腾自己的框架，定义自己的 sass，批量替换老的API，AST 就像手术刀，底层处理代码，很值得深入学习，

回到 Webpack，在第一篇里，我们在Webpack 整个流程里讲过，Webpack 把每个 文件都看成一个个Module,Module上的这些 `require，import` 依赖,也是通过 ast来判断的
依赖，然后通过 Resolve来加载这些模块，

那我们平常写的语法常见的有下面这样的
```
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  }
};
// main.js
const module1 = require('module1')
import modul2 from 'module2' 
import util from '../../util/'
import util from '@/util'
import '../style/main.css'
```
各种依赖 文件路径处理需要 resove的，Webpack 把这个独立出来了一个库 叫 `enhanced-resolve`,下篇就讲下 resolve 实现

那回到第一个问题  `JavaScript 是一门编译型语言还是解释型语言?`

JavaScript 是一门编译型语言，只不过 编译时间非常短，给人感觉是解释型语言

```
 sum(1,2)
 
 function sum(a,b){
     return a + b
 }
```
如果是解释型语言，代码一行行的读，这段代码是要报错的，但没有报错，我门说这个是函数提升，实际上就是 浏览器的编译过程，

  [1]: https://user-gold-cdn.xitu.io/2019/8/25/16cc913078a05c3b?w=707&h=184&f=jpeg&s=24348
  [2]: https://user-gold-cdn.xitu.io/2019/8/25/16cc913078e97498?w=750&h=766&f=png&s=76269
