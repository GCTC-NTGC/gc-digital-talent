module.exports = {
  globals: {
    "ts-jest": {
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
  },
  roots: ["src/js"],
  // https://alexjover.com/blog/enhance-jest-configuration-with-module-aliases/
  moduleNameMapper: {
    "@common(.*)$": "<rootDir>/../common/src/$1",
    "^.+\\.(css|less)$": "<rootDir>/src/js/tests/config/CssStub.js",
  },
  // Jest transformations -- this adds support for TypeScript
  // using ts-jest
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  collectCoverage: false,
  coverageReporters: ["json", "html"],
  collectCoverageFrom: [
    "src/js/**/*.{js,jsx,ts,tsx}",
    "!<rootDir>/node_modules/",
  ],
  coverageDirectory: "src/js/tests/coverage",

  // Module file extensions for importing
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  verbose: true,
  setupFilesAfterEnv: ["./src/js/tests/setup.ts"],
};
