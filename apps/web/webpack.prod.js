const { merge } = require("webpack-merge");
const base = require("./webpack.base.js");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = merge(base, {
  mode: "production",
  devtool: "source-map", // Recommended choice for production builds with high quality SourceMaps.
  performance: {
    maxAssetSize: 500000,
  },
  plugins: [
    // compress files with gzip
    new CompressionPlugin({
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
});
