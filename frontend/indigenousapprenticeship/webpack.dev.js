const { merge } = require('webpack-merge');
const common = require('./webpack.base.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: "eval-source-map", // Recommended choice for development builds with high quality SourceMaps.
});
