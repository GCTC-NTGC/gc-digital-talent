module.exports = {
  roots: ["src"],
  // https://alexjover.com/blog/enhance-jest-configuration-with-module-aliases/
  moduleNameMapper: {
    "^.+\\.(css|less)$": "<rootDir>/CssStub.js",
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
              },
            },
          ],
        },
      },
    ],
  },

  collectCoverage: false,
  coverageReporters: ["json", "html"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
  ],
  coverageDirectory: "src/tests/coverage",

  // Module file extensions for importing
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  verbose: true,
  setupFilesAfterEnv: ["./src/tests/setup.ts"],
};
