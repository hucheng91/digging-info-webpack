/*
 * @Author: hucheng
 * @Date: 2019-08-29 20:26:09
 * @Description: here is des
 */
const Resolver = require("./MyResolve")
const ParsePlugin = require("./ParsePlugin")
const ModuleKindPlugin = require("./ModuleKindPlugin")
const createResovler = function (options) {
    let modules = options.modules || ["node_modules"]
    const descriptionFiles = options.descriptionFiles || ["package.json"]
    let mainFields = options.mainFields || ["main"]
    const mainFiles = options.mainFiles || ["index"]
    const alias = options.alias || []
    const plugins = options.plugins || []

    let resolver = new Resolver()
    plugins.push(new ParsePlugin("resolve", "parsed-resolve"))
    plugins.push(new ModuleKindPlugin("parsed-resolve", "raw-module"))

    plugins.forEach(plugin => {
        plugin.apply(resolver);
    });

    return resolver;
}
const initConfig = function (options) {
    return createResovler(options)
}
exports.resolve = function (path, request, callback) {
    initConfig({}).resolve(path, request, callback)
}
