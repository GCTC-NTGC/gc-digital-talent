const { merge } = require('webpack-merge');
const common = require('./webpack.base.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: "source-map", // 	Recommended choice for production builds with high quality SourceMaps.
});
