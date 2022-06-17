const path = require("path");
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

const isMerged = (process.env.MERGE_STORYBOOKS === 'true');

module.exports = {
  "staticDirs": [
    { from: '../public', to: '/admin' },
    { from: '../../talentsearch/public', to: '/talent' },
    { from: '../../indigenousapprenticeship/public', to: '/indigenous-it-apprentice' }
  ],
  "stories": [
    `${ isMerged ? '../../admin/'        : '../' }**/*.stories.@(js|jsx|ts|tsx|mdx)`,
    `${ isMerged ? '../../talentsearch/' : '../' }**/*.stories.@(js|jsx|ts|tsx|mdx)`,
    `${ isMerged ? '../../common/'       : '../' }**/*.stories.@(js|jsx|ts|tsx|mdx)`,
    `${ isMerged ? '../../indigenousapprenticeship/' : '../' }**/*.stories.@(js|jsx|ts|tsx|mdx)`,
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

    return config;
  },
}
