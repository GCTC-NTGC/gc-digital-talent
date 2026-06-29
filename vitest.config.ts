import { defineConfig, mergeConfig } from "vitest/config";
import { uiConfig } from "@gc-digital-talent/vitest-helpers/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default mergeConfig(
  uiConfig,
  defineConfig({
    optimizeDeps: {
      include: [
        "react/jsx-dev-runtime",
        "@storybook/addon-a11y/preview",
        "@storybook/addon-vitest",
        "@storybook/react-vite",
        "@storybook/test",
        "@urql/core",
        "react-intl",
        "storybook-react-intl/preview",
        "date-fns",
        "date-fns/locale",
      ],
    },
    test: {
      coverage: {
        provider: "v8",
        enabled: true,
        reporter: ["text", "lcov"],
        exclude: [
          "**/node_modules/**",
          "./tc-report/**",
          "./.storybook/**",
          "**/*.stories.{ts,tsx}",
          "./apps/playwright/**",
          "**/dist/**",
          "**/assets/**",
          "**/eslint.config.{js,cjs,mjs,ts}",
          "**/vite.config.{js,cjs,mjs,ts}",
          "**/*.d.ts",
          "**/*.json",
        ],
      },
      projects: [
        "packages/*",
        "apps/web",
        {
          extends: true,
          plugins: [
            // The plugin will run tests for the stories defined in your Storybook config
            // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
            storybookTest({
              configDir: path.join(dirname, ".storybook"),
              tags: {
                skip: ["needs-fix"],
              },
            }),
          ],
          test: {
            name: "storybook",
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({}),
              instances: [
                {
                  browser: "chromium",
                },
              ],
            },
          },
        },
      ],
      setupFiles: ["@gc-digital-talent/vitest-helpers/setup"],
    },
  }),
);
