const { merge } = require("webpack-merge");
const base = require("./webpack.base.js");

module.exports = merge(base, {
  mode: "development",
  devtool: "eval-source-map", // Recommended choice for development builds with high quality SourceMaps.
});
