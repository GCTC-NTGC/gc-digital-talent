/* eslint-disable import/prefer-default-export */
import type { Options } from "tsup";

const env = process.env.NODE_ENV;

export const tsup: Options = {
  splitting: false,
  sourcemap: env === "prod", // source map is only available in prod
  clean: true, // rimraf dist
  dts: true, // generate dts file for main module
  silent: true, // reduce CLI output
  format: ["esm", "cjs"], // generate cjs and esm files
  minify: env === "production",
  bundle: true,
  skipNodeModulesBundle: true,
  entryPoints: ["src/index.tsx"],
  watch: env === "development",
  target: "es2020",
  outDir: "dist",
  external: ["react"],
};
