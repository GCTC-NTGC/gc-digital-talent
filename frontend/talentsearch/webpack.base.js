const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TsTransformer = require("@formatjs/ts-transformer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
require('dotenv').config({ path: './.env' });
var shell = require("shelljs");

module.exports = {
  entry: {
    app: [
      "./src/js/pageContainer.tsx",
      "../common/src/css/hydrogen.css",
      "../common/src/css/hydrogen.vars.css",
      "../common/src/css/common.css",
      "./src/css/app.css",
    ],
  },
  watchOptions: {
    ignored: ['/node_modules/', '**/hydrogen.css', '**/hydrogen.vars.css', '**/hydrogen-logs/' ]
  },
  plugins: [

    //
    // =========================================================================
    // Run Hydrogen on Webpack's compile hook
    // Note that it's necessary to cd back into the common folder first, so should our workspaces layout change, this path will need to be updated.
    {
      apply: (compiler) => {
        compiler.hooks.beforeCompile.tap("Run Hydrogen", () => {
          shell.exec('(cd ../common;node node_modules/@hydrogen-design-system/hydrogen.css/bin/build.js)');
        });
      },
    },

    // process and copy CSS files
    new MiniCssExtractPlugin({ filename: "[name].css?id=[contenthash]" }),

    // plain copy files to target folder
    new CopyPlugin({
      patterns: [
        {
          context: "public/",
          from: "**/*",
          globOptions: {
            dot: true,
            ignore: ["**/public/index.html"],
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
      },
    }),

    // generate an index.html file based on given template
    new HtmlWebpackPlugin({
      title: "GC Talent",
      template: path.resolve(__dirname, "public/index.html"),
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
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      // resolver for shared common project
      "@common": path.resolve(__dirname, "../common/src"),
    },
  },
  output: {
    publicPath: "/talent", // final path for routing
    filename: "[name].js?id=[contenthash]", // file hashing for cache busting
    path: path.resolve(__dirname, "dist"), // output folder
    clean: true, // delete existing files on recompile
  },
};
