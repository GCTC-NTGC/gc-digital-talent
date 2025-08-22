import path from "path";
import dotenv from "dotenv";
import type { StorybookConfig } from "@storybook/react-vite";

const webStories = "../apps/web/src/**/*.stories.@(js|jsx|ts|tsx|mdx)";
const designFormsStories =
  "../packages/forms/src/**/*.stories.@(js|jsx|ts|tsx|mdx)";
const designToastStories =
  "../packages/toast/src/**/*.stories.@(js|jsx|ts|tsx|mdx)";
const designUiStories = "../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx|mdx)";
const stories = [
  webStories,
  designFormsStories,
  designToastStories,
  designUiStories,
  "!**/node_modules/**",
];

dotenv.config({ path: "./apps/web/.env" });

const main: StorybookConfig = {
  stories,
  staticDirs: ["../apps/web/src/assets"],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-designs",
    "@storybook/addon-themes",
    "storybook-react-intl",
  ],
  core: {
    builder: "@storybook/builder-vite",
  },
  framework: "@storybook/react-vite",
  async viteFinal(config) {
    const { mergeConfig } = await import("vite");
    return mergeConfig(config, {
      plugins: [
        ...(config.plugins ?? []).filter(
          (plugin) =>
            plugin &&
            "name" in plugin &&
            // Filter out git version plugin to hardcode for
            // Stable snapshots
            plugin.name !== "git-version",
        ),
        // Weird thing to get tailwind working with storybook
        (await import("@tailwindcss/vite")).default(),
      ],
      define: {
        // Hardcode vars for stable snapshots
        BUILD_DATE: JSON.stringify("1970-01-01"),
        VERSION: JSON.stringify("v1.0.0"),
      },
      resolve: {
        extensions: [".ts", ".tsx", ".json", ".js"],
        alias: {
          "~": path.resolve(__dirname, "..", "apps/web/src"),
        },
      },
    });
  },
};

export default main;
