/* eslint-disable import/prefer-default-export */
import type { Options } from "tsup";

const env = process.env.NODE_ENV;

export const tsup: Options = {
  splitting: false,
  sourcemap: env === "prod", // source map is only available in prod
  clean: true, // rimraf dist
  dts: true, // generate dts file for main module
  format: ["esm", "cjs"], // generate cjs and esm files
  minify: env === "production",
  bundle: env === "production",
  skipNodeModulesBundle: true,
  entryPoints: ["src/index.tsx", "src/cli.ts"],
  watch: env === "development",
  target: "es2020",
  outDir: "dist",
  external: ["react", "lodash"],
};
