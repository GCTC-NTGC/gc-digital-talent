import { defineConfig, mergeConfig } from "vitest/config";
import baseConfig from "./base-config.mjs";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: "jsdom",
    },
  }),
);
