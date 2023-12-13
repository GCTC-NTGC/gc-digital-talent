const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TsTransformer = require("@formatjs/ts-transformer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
require("dotenv").config({ path: "./.env" });


const gitCommand = (cmd) => {
  let result;
  try {
    result = require("child_process").execSync("git " + cmd);
  } catch (err) {
    console.log(err);
  }

  if (result) {
    result = result.toString().trim();
  }

  return result;
};

module.exports = (basePath, appMeta) => {
  let version, commitHash;
  if (gitCommand("--version")) {
    version = gitCommand("describe --abbrev=0");
    commitHash = gitCommand("rev-parse --short HEAD");
  }

  const meta = {
    type: "website",
    ...appMeta
  };

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
              ignore: [
                "**/public/index.html",
                "**/.DS_Store",
                "**/public/config.ejs",
              ],
            },
          },
        ],
      }),

      // search and replace environment variables
      new DefinePlugin({
        "process.env": {
          API_URI: JSON.stringify(process.env.API_URI),
          BUILD_DATE: JSON.stringify(new Date()),
          API_SUPPORT_ENDPOINT: JSON.stringify(
            process.env.API_SUPPORT_ENDPOINT,
          ),
          TALENTSEARCH_SUPPORT_EMAIL: JSON.stringify(
            process.env.TALENTSEARCH_SUPPORT_EMAIL,
          ),
          VERSION: version ? JSON.stringify(version) : undefined,
          COMMIT_HASH: commitHash ? JSON.stringify(commitHash) : undefined,
        },
      }),

      // generate an index.html file based on given template
      new HtmlWebpackPlugin({
        title: meta.title,
        template: "./public/index.html",
        meta: {
          description: meta.description,
          "og:url": { property: 'og:url', content: meta.url },
          "og:type": { property: 'og:type', content: meta.type },
          "og:title": { property: 'og:title', content: meta.title },
          "og:description": { property: 'og:description', content: meta.description },
          "og:image": { property: 'og:image', content: meta.image },
          "twitter:domain": { property: 'twitter:domain', content: meta.domain },
          "twitter:url": { property: 'twitter:url', content: meta.url },
          "twitter:title": { property: 'twitter:title', content: meta.title },
          "twitter:image": { property: 'twitter:image', content: meta.image },
        },
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
              loader: "babel-loader",
              options: {
                filename: ".babelrc",
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
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(pdf|doc|docx)$/i,
          type: "asset/resource",
          generator: {
            filename: "documents/[name][ext]",
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
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
  };
};
