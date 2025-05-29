import type { StorybookConfig } from "@storybook/react-vite";

const webStories = "../src/**/*.stories.@(js|jsx|ts|tsx|mdx)";
const designFormsStories =
  "../../../packages/forms/src/**/*.stories.@(js|jsx|ts|tsx|mdx)";
const designToastStories =
  "../../../packages/toast/src/**/*.stories.@(js|jsx|ts|tsx|mdx)";
const designUiStories =
  "../../../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx|mdx)";
let stories = [
  webStories,
  designFormsStories,
  designToastStories,
  designUiStories,
  "!**/node_modules/**",
];
// eslint-disable-next-line turbo/no-undeclared-env-vars
const sbApp = process.env.SB_APP;
if (sbApp) {
  if (sbApp === "web") {
    stories = [webStories];
  } else if (sbApp === "design") {
    stories = [designFormsStories, designToastStories, designUiStories];
  }
}

const main: StorybookConfig = {
  stories,
  staticDirs: ["../src/assets"],
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
  // Weird fix that I do not fully understand
  // REF: https://stackoverflow.com/questions/77540892/chromatic-github-action-is-failing
  async viteFinal(config) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import("vite");

    return mergeConfig(config, {
      define: {
        // Hardcode vars for stable snapshots
        BUILD_DATE: JSON.stringify("1970-01-01"),
        VERSION: JSON.stringify("v1.0.0"),
      },
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
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: ["storybook-dark-mode"],
      },
    });
  },
};

export default main;
