import { defineConfig, mergeConfig } from "vitest/config";

import { uiConfig } from "@gc-digital-talent/vitest-helpers/config";

export default mergeConfig(
  uiConfig,
  defineConfig({
    test: {
      setupFiles: ["@gc-digital-talent/vitest-helpers/setup"],
    },
  }),
);
