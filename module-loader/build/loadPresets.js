const webpackMerge = require("webpack-merge");

module.exports  = env => {
    const presets = env.presets || [];
    console.log(presets)

    const mergedPresets = [].concat(...[presets]);
    const mergerdConfigs = mergedPresets.map( presetName => {
        return require(`./presets/webpack.${presetName}`)(env)
    });

    return webpackMerge({},...mergerdConfigs);
}