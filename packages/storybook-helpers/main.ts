/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prefer-destructuring */
import type { StorybookConfig } from "@storybook/react-webpack5";

const path = require("path");

const HydrogenPlugin = require("hydrogen-webpack-plugin");
const TsTransformer = require("@formatjs/ts-transformer");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

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
            preserveWhitespace: true,
          }),
        ],
      };
    },
  },
  exclude: /node_modules/,
};

const staticDocumentsRule = {
  test: /\.(pdf|doc|docx|pptx)$/i,
  type: "asset/resource",
  generator: {
    filename: "documents/[name][ext]",
  },
};

const webStories = "../src/**/*.stories.@(js|jsx|ts|tsx|mdx)";
const designStories =
  "../../../packages/**/src/**/*.stories.@(js|jsx|ts|tsx|mdx)";
let stories = [webStories, designStories];
const sbApp = process.env.SB_APP;
if (sbApp) {
  if (sbApp === "web") {
    stories = [webStories];
  } else if (sbApp === "design") {
    stories = [designStories];
  }
}

const main: StorybookConfig = {
  stories,
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-essentials",
    "@storybook/addon-links",
    "@storybook/addon-viewport",
    "storybook-addon-intl",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: true,
  },
  webpackFinal: async (config) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    config.resolve?.extensions?.push(".tsx", ".ts");
    config.module?.rules?.push(reactIntlTransformRule, staticDocumentsRule);
    if (config.resolve?.alias) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "~": path.resolve(__dirname, "../../apps/web/src/"),
      };
    }

    config.resolve?.plugins?.push(
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),
    );

    config.plugins?.push(
      new HydrogenPlugin({
        outputFile: path.resolve(
          __dirname,
          "../../apps/web/src/assets/css/hydrogen.css",
        ),
      }),
    );

    return config;
  },
};

export default main;
