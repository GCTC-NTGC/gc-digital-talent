import { defineConfig } from "vitest/config";
import { uiConfig } from "@gc-digital-talent/vitest-helpers/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  ...uiConfig,
  test: {
    ...uiConfig.test,
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
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
    setupFiles: ["@gc-digital-talent/vitest-helpers/setup"],
  },
});
