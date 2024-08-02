import type { Config } from "jest";

const config: Config = {
  roots: ["src"],
  preset: "@gc-digital-talent/jest-presets/jest/browser",
  // https://alexjover.com/blog/enhance-jest-configuration-with-module-aliases/
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|pdf|doc|docx)+(\\?url)?$":
      "<rootDir>/src/tests/mocks/fileMock.ts",
    "\\.(css|less)$": "<rootDir>/src/tests/mocks/styleMock.ts",
    "~(.*)$": "<rootDir>/src/$1",
  },
  // Jest transformations -- this adds support for TypeScript
  // using ts-jest
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        astTransformers: {
          before: [
            {
              path: "@formatjs/ts-transformer/ts-jest-integration",
              options: {
                // options
                overrideIdFn: "[sha512:contenthash:base64:6]",
                ast: true,
                preserveWhitespace: true,
              },
            },
          ],
        },
      },
    ],
  },
  collectCoverage: false,
  coverageReporters: ["json", "html"],
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!<rootDir>/node_modules/"],
  coverageDirectory: "src/tests/coverage",

  // Module file extensions for importing
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  verbose: true,
  setupFilesAfterEnv: ["./src/tests/setup.ts"],
};

export default config;
