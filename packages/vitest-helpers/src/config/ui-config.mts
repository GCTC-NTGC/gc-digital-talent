/// <reference types="vitest" />
import { defineConfig, mergeConfig } from "vitest/config";
import baseConfig from "./base-config.mts";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: "jsdom",
    },
  }),
);
