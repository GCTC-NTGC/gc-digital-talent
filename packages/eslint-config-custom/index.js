const { resolve } = require("node:path");
const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier",
  ],
  ignorePatterns: [
    "index.js",
    ".eslintrc",
    ".eslintrc.cjs",
    "tsconfig.json",
    "styleMock.ts",
    "fileMock.ts",
    ".turbo",
    "gql/graphql.ts",
    "dist/**",
  ],
  overrides: [
    {
      files: ["**/?(*.)+(test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
    project,
  },
  plugins: [
    "import",
    "no-only-tests",
    "@typescript-eslint",
    "turbo",
    "deprecation",
  ],
  rules: {
    camelcase: [
      "warn",
      {
        allow: ["w*Query$", "w*Fragment$", "w*Mutation$", "w*Document$"],
      },
    ],
    "consistent-return": "warn",
    "import/no-extraneous-dependencies": "off",
    "import/extensions": ["warn", "never", { json: "always" }],
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        distinctGroup: false,
        groups: [
          "builtin",
          "external",
          "unknown",
          "internal",
          ["parent", "sibling"],
          "index",
        ],
        pathGroups: [
          {
            pattern: "@gc-digital-talent/**",
            group: "unknown",
          },
          {
            pattern: "~/**",
            group: "internal",
          },
        ],
        pathGroupsExcludedImportTypes: ["@gc-digital-talent/**"],
      },
    ],
    "no-only-tests/no-only-tests": "error",
    "no-param-reassign": "warn",
    "no-use-before-define": "off",
    "no-shadow": "off",
    "no-console": "error",
    "no-alert": "error",
    "@typescript-eslint/no-use-before-define": "warn",
    "@typescript-eslint/no-shadow": "error",
    "@typescript-eslint/no-empty-function": "warn",
    "no-underscore-dangle": ["error", { allow: ["__typename"] }],

    // CI Only rules to keep local snappy
    "import/no-named-as-default": process.env.CI ? "warn" : "off",
    "import/namespace": process.env.CI ? "error" : "off",
    "deprecation/deprecation": process.env.CI ? "warn" : "off",
  },
  settings: {
    react: {
      version: "18.0",
    },
    "import/extensions": [".ts", ".tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
};
