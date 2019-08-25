/*
 * @Author: hucheng
 * @Date: 2019-08-25 18:44:17
 * @Description: here is des
 */
const acron = require('acorn')
var traverse = require("ast-traverse");
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
