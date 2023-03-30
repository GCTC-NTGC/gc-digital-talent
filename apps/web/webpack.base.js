const path = require("path");
const { merge } = require("webpack-merge");
const HydrogenPlugin = require("hydrogen-webpack-plugin");
const base = require("@gc-digital-talent/webpack-config/webpack.base.js");

const basePath = path.resolve(__dirname);

module.exports = merge(base(basePath), {
  entry: {
    app: [
      "./src/main.tsx",
      "./src/assets/css/hydrogen.css",
      "./src/assets/css/app.css",
    ],
  },
  plugins: [
    // Run Hydrogen on Webpack's compiler hooks
    new HydrogenPlugin({
      outputFile: path.resolve(__dirname, "./src/assets/css/hydrogen.css"),
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "~": path.resolve(basePath, "./src/"),
    },
  },
  stats: "errors-warnings",
  output: {
    publicPath: "/", // final path for routing
    filename: "[name].[contenthash].js", // file hashing for cache busting
    chunkFilename: "[name].[contenthash].js", // file hashing for cache busting
    path: path.resolve(basePath, "dist"), // output folder
    clean: true, // delete existing files on recompile
  },
});
