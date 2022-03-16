require("dotenv").config();
require("laravel-mix-polyfill");

const mix = require("laravel-mix");
const path = require("path");

// Check if any of the OAUTH variables are defined for this project.  A message is displayed to notify of improper use.
mix.before(() => {
  const authVariables = [
    "OAUTH_URI", "OAUTH_TOKEN_URI", "OAUTH_ADMIN_CLIENT_ID", "OAUTH_ADMIN_CLIENT_SECRET"
  ];
  if(authVariables.some((v) => process.env.hasOwnProperty(v)))
    throw 'OAUTH variables should be defined in the api project, not the admin project.  Compare the .env file to the .env.example for proper use.  https://github.com/GCTC-NTGC/gc-digital-talent/pull/2220';
});

const webpack = require("webpack");
const dotenvplugin = new webpack.DefinePlugin({
  "process.env": {
    API_URI: JSON.stringify(process.env.API_URI),
    ADMIN_APP_URL: JSON.stringify(process.env.ADMIN_APP_URL),
    ADMIN_APP_DIR: JSON.stringify(process.env.ADMIN_APP_DIR),
    BUILD_DATE: JSON.stringify(new Date()),
    OAUTH_LOGOUT_URI: JSON.stringify(process.env.OAUTH_LOGOUT_URI),
    OAUTH_POST_LOGOUT_REDIRECT: JSON.stringify(process.env.OAUTH_POST_LOGOUT_REDIRECT),
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
  .ts("resources/js/dashboard.tsx", "public/js")
  .css("../common/src/css/hydrogen.css", "public/css")
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
      "@common": path.resolve("../common/src"),
    },
  },
  module: {
    rules: [
      reactIntlTransformRule
    ],
  },
  output: {
    hashFunction: 'md4'
  },
});

mix.version();
mix.sourceMaps();
