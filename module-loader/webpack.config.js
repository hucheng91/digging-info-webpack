/*
 * @Author: hucheng
 * @Date: 2019-08-11 18:13:13
 * @Description: here is des
 */
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");

const loadPresets = require("./build/loadPresets");
const modeConfig = env => require(`./build/webpack.${env.mode}.js`)(env);
console.log('tag', modeConfig)
module.exports = ({ mode = "production", presets = [] }) => {
    return webpackMerge(
        {
            stats: 'verbose',
            entry: {
                main: "./module-loader/src/index.js",
            },
            mode: 'development',
            module: {
                rules: [
                    { test: /\.css$/, use: 'css-loader' }
                ]
            },
        },
        modeConfig({ mode, presets }),
        loadPresets({ mode, presets })
    );
};
