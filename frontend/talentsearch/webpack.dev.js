const CopyPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.base.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: "eval-source-map", // Recommended choice for development builds with high quality SourceMaps.
  plugins: [
    new CopyPlugin({
      patterns: [
        // a copy without the substituted variables to use the defaults in the local docker container
        {
          from: "config.dev.js",
          to: "config.js"
        }
      ]
    })
  ]
});
