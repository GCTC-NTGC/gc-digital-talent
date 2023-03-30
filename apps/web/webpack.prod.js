const { merge } = require("webpack-merge");
const base = require("./webpack.base.js");

module.exports = merge(base, {
  mode: "production",
  devtool: "source-map", // Recommended choice for production builds with high quality SourceMaps.
});
