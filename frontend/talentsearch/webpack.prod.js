const CopyPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.base.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: "source-map", // 	Recommended choice for production builds with high quality SourceMaps.
  plugins: [
    new CopyPlugin({
      patterns: [
        // a copy to a template file for substitutions during post-deploy
        {
          from: "config.prod.js",
          to: "config.js.template"
        }
      ]
    })
  ]
});
