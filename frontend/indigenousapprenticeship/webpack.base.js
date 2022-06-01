const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TsTransformer = require("@formatjs/ts-transformer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
require('dotenv').config({ path: './.env' });

module.exports = {
  entry: {
    app: [
      "./src/js/pageContainer.tsx",
      "../common/src/css/hydrogen.css",
      "../common/src/css/common.css",
      "./src/css/app.css",
    ],
  },
  plugins: [
    // process and copy CSS files
    new MiniCssExtractPlugin({ filename: "[name].css?id=[contenthash]" }),

    // plain copy files to target folder
    new CopyPlugin({
      patterns: [
        { from: "src/images", to: "images" },
        { from: "src/.htaccess" },
        { from: "src/config.sjs" },
        { from: "src/site.webmanifest" },
      ],
    }),

    // search and replace environment variables
    new DefinePlugin({
      "process.env": {
        API_URI: JSON.stringify(process.env.API_URI),
        INDIGENOUSAPPRENTICESHIP_APP_URL: JSON.stringify(process.env.INDIGENOUSAPPRENTICESHIP_APP_URL),
        INDIGENOUSAPPRENTICESHIP_APP_DIR: JSON.stringify(process.env.INDIGENOUSAPPRENTICESHIP_APP_DIR),
        BUILD_DATE: JSON.stringify(new Date()),
      },
    }),

    // generate an index.html file based on given template
    new HtmlWebpackPlugin({
      title: "Indigenous Apprenticeship Program",
      template: path.resolve(__dirname, "./src/views/page_container.html"),
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
    publicPath: "/indigenous-it-apprentice", // final path for routing
    filename: "[name].js?id=[contenthash]", // file hashing for cache busting
    path: path.resolve(__dirname, "dist"), // output folder
    clean: true, // delete existing files on recompile
  },
};
