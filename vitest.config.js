import { defineConfig } from "vitest/config";

import { uiConfig } from "@gc-digital-talent/vitest-helpers/config";

export default defineConfig({
  ...uiConfig,
  test: {
    ...uiConfig.test,
    coverage: {
      provider: "v8",
      enabled: true,
      reporter: ["text", "lcov"],
      exclude: ["**/node_modules/**", "./tc-report/**"],
    },
    projects: ["packages/*", "apps/web"],
    setupFiles: ["@gc-digital-talent/vitest-helpers/setup"],
  },
});
