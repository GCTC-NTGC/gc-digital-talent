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

const isMerged = (process.env.MERGE_STORYBOOKS === 'true');

module.exports = {
  "staticDirs": [
    { from: '../public', to: '/admin' },
    { from: '../../talentsearch/public', to: '/talent' },
    { from: '../../indigenousapprenticeship/public', to: '/indigenous-it-apprentice' }
  ],
  "stories": [
    `${ isMerged ? '../../admin/src/'        : '../src/' }**/*.stories.@(js|jsx|ts|tsx|mdx)`,
    `${ isMerged ? '../../talentsearch/src/' : '../src/' }**/*.stories.@(js|jsx|ts|tsx|mdx)`,
    `${ isMerged ? '../../common/src/'       : '../src/' }**/*.stories.@(js|jsx|ts|tsx|mdx)`,
    `${ isMerged ? '../../indigenousapprenticeship/src/' : '../src/' }**/*.stories.@(js|jsx|ts|tsx|mdx)`,
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
        "@common": path.resolve('../common/src'),
    }

    config.module.rules = [
      ...config.module.rules,
      reactIntlTransformRule,
    ];

    //
    // =========================================================================
    // Run Hydrogen on Webpack's compile hook
    // Note that it's necessary in both instances to cd up and into the common folder
    config.plugins.push(
      {
        apply: (compiler) => {
          //
          // -------------------------------------------------------------------
          // Build Hydrogen
          // Run on the environment hook to catch the initial compile and non-watch compiles
          compiler.hooks.environment.tap('environment', () => {
            shell.exec('cd ..;node node_modules/@hydrogen-css/hydrogen/bin/build.js');
          })
          //
          // -------------------------------------------------------------------
          // Build Hydrogen and manipulate it's modified time
          // Run on the invalid hook so that the file time is updated before the next compile
          compiler.hooks.invalid.tap('invalid', (fileName, changeTime) => {
            shell.exec('cd ..;node node_modules/@hydrogen-css/hydrogen/bin/build.js');
            var f = path.resolve('../common/src/css/hydrogen.css')
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
