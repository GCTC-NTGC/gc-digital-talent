import { defineConfig } from "vitest/config";

import { uiConfig } from "@gc-digital-talent/vitest-helpers/config";

export default defineConfig({
  ...uiConfig,
  test: {
    ...uiConfig.test,
    setupFiles: ["@gc-digital-talent/vitest-helpers/setup"],
  },
});
