import { defineConfig, mergeConfig } from "vitest/config";
import path from "node:path";

import { uiConfig } from "@gc-digital-talent/vitest-helpers/config";

export default mergeConfig(
  uiConfig,
  defineConfig({
    test: {
      setupFiles: ["@gc-digital-talent/vitest-helpers/setup"],
    },
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "src"),
      },
    },
  }),
);
