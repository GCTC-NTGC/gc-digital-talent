const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const TsTransformer = require("@formatjs/ts-transformer");

module.exports = {
  mode: "development",
  entry: {
    app: [
      "./src/js/pageContainer.tsx",
      "../common/src/css/hydrogen.css",
      "../common/src/css/common.css",
      "./src/css/app.css",
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "src/images", to: "images" },
        { from: "src/views/page_container.blade.php", to: "index.html" },
        { from: "src/.htaccess" },
        { from: "src/site.webmanifest" },
      ],
    }),
    new Dotenv(),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              getCustomTransformers() {
                return {
                  before: [
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
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@common": path.resolve(__dirname, "../common/src"),
    },
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};
