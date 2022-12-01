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

module.exports = {
  entry: {
    app: [
      "./src/js/main.tsx",
      "../common/src/css/hydrogen.css",
      "../common/src/css/common.css",
      "./src/css/app.css",
    ],
  },
  plugins: [

    // Run Hydrogen on Webpack's compiler hooks
    // Note that it's necessary in both instances to cd up and into the common folder
    {
      apply: (compiler) => {
        // Build Hydrogen
        // Run on the environment hook to catch the initial compile and non-watch compiles
        compiler.hooks.environment.tap('environment', () => {
          shell.cd('..');
          shell.exec('node node_modules/@hydrogen-css/hydrogen/bin/build.js');
        })
        // Build Hydrogen and manipulate it's modified time
        // Run on the invalid hook so that the file time is updated before the next compile
        compiler.hooks.invalid.tap('invalid', (fileName, changeTime) => {
          shell.exec('node node_modules/@hydrogen-css/hydrogen/bin/build.js');
          var f = path.resolve('common/src/css/hydrogen.css')
          var now = Date.now() / 1000
          var then = now - 100
          fs.utimes(f, then, then, function (err) { if (err) throw err })
        })
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
            ignore: ["**/public/index.html", "**/.DS_Store", "**/public/config.ejs"],
          },
        },
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
      template: path.resolve(__dirname, "public/index.html"),
    }),

    // generate an config file with the environment variables (not actually HTML but it's handy to reuse the plugin)
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/config.ejs"),
      filename: "config.js",
      inject: false,
      environment: process.env,
      minify: false, // minify in production causes this to fail
    }),

    // run some checks before compilation begins
    {
      apply: (compiler) => {
        compiler.hooks.compile.tap("Preflight check", () => {
          const authVariables = [
            "OAUTH_URI", "OAUTH_TOKEN_URI", "OAUTH_ADMIN_CLIENT_ID", "OAUTH_ADMIN_CLIENT_SECRET"
          ];
          if (authVariables.some((v) => process.env.hasOwnProperty(v)))
            throw 'OAUTH variables should be defined in the api project, not the admin project.  Compare the .env file to the .env.example for proper use.  https://github.com/GCTC-NTGC/gc-digital-talent/pull/2220';
        });
      },
    },
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
    chunkFilename: "[name].js?id=[contenthash]",
    path: path.resolve(__dirname, "dist"), // output folder
    clean: true, // delete existing files on recompile
  },
};
