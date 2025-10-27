import { defineProject, mergeConfig } from "vitest/config";

import baseConfig from "./base-config.mjs";

export default mergeConfig(
  baseConfig,
  defineProject({
    test: {
      environment: "jsdom",
    },
  }),
);
