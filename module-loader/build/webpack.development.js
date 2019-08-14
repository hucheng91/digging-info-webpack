const path = require("path")
module.exports = (env) => ({
    output: {
        filename: '[name].js',
        path: path.resolve('dist',env.mode) 
      }
});
