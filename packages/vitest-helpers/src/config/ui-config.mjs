import { defineProject, mergeConfig } from "vitest/config";

import baseConfig from "./base-config";

export default mergeConfig(
  baseConfig,
  defineProject({
    test: {
      environment: "jsdom",
    },
  }),
);
