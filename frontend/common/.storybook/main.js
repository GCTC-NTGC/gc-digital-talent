const path = require("path");
const TsTransformer = require("@formatjs/ts-transformer");
const transform = TsTransformer.transform;
const shell = require("shelljs");
const fs = require("fs");
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

module.exports = {
  "staticDirs": [
    { from: '../../talentsearch/src', to: '/talent' },
    { from: '../../admin/src', to: '/admin' },
    { from: '../../indigenousapprenticeship/src', to: '/indigenousapprenticeship' }
  ],

  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "storybook-addon-intl"
  ],
  "core": {
    "builder": "webpack5"
  },
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    config.resolve.alias = {
        ...config.resolve.alias,
    }

    config.module.rules = [
      ...config.module.rules,
      reactIntlTransformRule,
    ];

    // Run Hydrogen on Webpack's compiler hooks ================================
    // Note that this version is unique from the other workspaces because we're already inside the common folder
    config.plugins.push(
      {
        apply: (compiler) => {
          // Build Hydrogen ----------------------------------------------------
          // Run on the environment hook to catch the initial compile and non-watch compiles
          compiler.hooks.environment.tap('environment', () => {
            shell.cd('..');
            shell.exec('node node_modules/@hydrogen-css/hydrogen/bin/build.js');
          })
          // Build Hydrogen and manipulate it's modified time ------------------
          // Run on the invalid hook so that the file time is updated before the next compile
          compiler.hooks.invalid.tap('invalid', (fileName, changeTime) => {
            shell.exec('node node_modules/@hydrogen-css/hydrogen/bin/build.js');
            var f = path.resolve('common/src/css/hydrogen.css')
            var now = Date.now() / 1000
            var then = now - 100
            fs.utimes(f, then, then, function (err) { if (err) throw err })
          })
        },
      }
    )

    return config;
  },
}
