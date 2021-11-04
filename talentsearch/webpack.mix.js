require("dotenv").config();
require("laravel-mix-polyfill");

const mix = require("laravel-mix");
const path = require("path");

let webpack = require("webpack");
let dotenvplugin = new webpack.DefinePlugin({
  "process.env": {
    API_URI: JSON.stringify(process.env.API_URI),
    TALENTSEARCH_APP_URL: JSON.stringify(process.env.TALENTSEARCH_APP_URL),
    TALENTSEARCH_APP_DIR: JSON.stringify(process.env.TALENTSEARCH_APP_DIR),
  },
});

const TsTransformer = require("@formatjs/ts-transformer");
const transform = TsTransformer.transform;
// This uses ts-loader to inject generated ids into react-intl messages.
const reactIntlTransformRule = {
  test: /\.tsx?$/,
  loader: "ts-loader",
  options: {
    getCustomTransformers() {
      return {
        before: [
          transform({
            overrideIdFn: "[sha512:contenthash:base64:6]",
          }),
        ],
      };
    },
  },
  exclude: /node_modules/,
};

mix
  .ts("resources/js/pageContainer.tsx", "public/js")
  .css("resources/css/hydrogen.css", "public/css")
  .css("../common/src/css/common.css", "public/css")
  .css("resources/css/app.css", "public/css")
  .polyfill({
    enabled: true,
    useBuiltIns: "usage",
    targets: "firefox 50, IE 11",
  });

mix.webpackConfig({
  plugins: [dotenvplugin],
  resolve: {
    alias: {
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
      "react-hook-form": path.resolve("./node_modules/react-hook-form"),
      "@common": path.resolve("../common/src"),
    },
  },
  module: {
    rules: [reactIntlTransformRule],
  },
  output: {
    hashFunction: 'md4'
  },
});

mix.version();
