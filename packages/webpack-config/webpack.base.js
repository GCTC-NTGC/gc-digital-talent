const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TsTransformer = require("@formatjs/ts-transformer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
require('dotenv').config({ path: './.env' });
const shell = require("shelljs");
const fs = require("fs");

module.exports = (basePath) => {
  return {
    plugins: [

      // process and copy CSS files
      new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),

      // plain copy files to target folder
      new CopyPlugin({
        patterns: [
          {
            context: "public/",
            from: "**/*",
            globOptions: {
              dot: true,
              ignore: ["**/public/index.html", "**/.DS_Store", "**/public/config.ejs"],
            },
          },
        ],
      }),

      // search and replace environment variables
      new DefinePlugin({
        "process.env": {
          API_URI: JSON.stringify(process.env.API_URI),
          TALENTSEARCH_APP_URL: JSON.stringify(process.env.TALENTSEARCH_APP_URL),
          TALENTSEARCH_APP_DIR: JSON.stringify(process.env.TALENTSEARCH_APP_DIR),
          BUILD_DATE: JSON.stringify(new Date()),
          API_SUPPORT_ENDPOINT: JSON.stringify(process.env.API_SUPPORT_ENDPOINT),
          TALENTSEARCH_SUPPORT_EMAIL: JSON.stringify(process.env.TALENTSEARCH_SUPPORT_EMAIL),
          TALENTSEARCH_RECRUITMENT_EMAIL: JSON.stringify(process.env.TALENTSEARCH_RECRUITMENT_EMAIL),
        },
      }),

      // generate an index.html file based on given template
      new HtmlWebpackPlugin({
        title: "GC Digital Talent",
        template: "./public/index.html",
      }),

      // generate an config file with the environment variables (not actually HTML but it's handy to reuse the plugin)
      new HtmlWebpackPlugin({
        template: path.resolve(basePath, "./public/config.ejs"),
        filename: "config.js",
        inject: false,
        environment: process.env,
        minify: false, // minify in production causes this to fail
      }),
    ],
    module: {
      rules: [
        {
          // transpile typescript files
          test: /\.ts(x?)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                "filename": ".babelrc"
              },
            },
            {
              loader: "ts-loader",
              options: {
                getCustomTransformers() {
                  return {
                    before: [
                      // formatjs transformer for intl strings
                      TsTransformer.transform({
                        overrideIdFn: "[sha512:contenthash:base64:6]",
                      }),
                    ],
                  };
                },
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          // load css files
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    /**
   * Optimizations only run in production mode
   *
   * Ref: https://webpack.js.org/configuration/optimization/
   */
    optimization: {
      minimizer: [
        `...`, // Includes default minimizers
        new CssMinimizerPlugin(),
      ],
    },
    output: {
      publicPath: "/talent/", // final path for routing
      filename: "[name].[contenthash].js", // file hashing for cache busting
      chunkFilename: "[name].[contenthash].js", // file hashing for cache busting
      path: path.resolve(basePath, "dist"), // output folder
      clean: true, // delete existing files on recompile
    },
  }
}
