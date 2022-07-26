const path = require("path");
const TsTransformer = require("@formatjs/ts-transformer");
const transform = TsTransformer.transform;
var shell = require("shelljs");
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
  "staticDirs": [ { from: '../public', to: '/talent' } ],
  "stories": [
    "../src/js/**/*.stories.mdx",
    "../src/js/**/*.stories.@(js|jsx|ts|tsx)"
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
    //
    // -------------------------------------------------------------------------
    // Modify the ignored files list to include Hydrogen
    config.watchOptions.ignored = ['**/node_modules/', '**/hydrogen.css', '**/hydrogen.vars.css', '**/hydrogen-logs/' ];
    //
    // -------------------------------------------------------------------------
    // Execute the node script on the compile hook
    // Note that it's necessary to cd back into the common folder first, so should our workspaces layout change, this path will need to be updated.
    config.plugins.push(
      {
        apply: (compiler) => {
          compiler.hooks.beforeCompile.tap("Run Hydrogen", () => {
            shell.echo('');
            shell.exec('(cd ../common;node node_modules/@hydrogen-design-system/hydrogen.css/bin/build.js)');
          });
        },
      }
    )

    return config;
  },
}
