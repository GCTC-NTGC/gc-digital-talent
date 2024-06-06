/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prefer-destructuring */
import type { StorybookConfig } from "@storybook/react-vite";

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
  staticDirs: ["../src/assets"],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-essentials",
    "storybook-react-intl",
  ],
  core: {
    builder: "@storybook/builder-vite",
  },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};

export default main;
