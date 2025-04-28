// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { flatConfigs as importFlatConfigs } from "eslint-plugin-import";
import turbo from "eslint-plugin-turbo";
import testingLibrary from "eslint-plugin-testing-library";
import noOnlyTests from "eslint-plugin-no-only-tests";
import prettierConfig from "eslint-config-prettier/flat";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  turbo.configs["flat/recommended"],
  testingLibrary.configs["flat/react"],
  {
    ignores: [
      "eslint.config.js",
      "eslint.config.mjs",
      "**/index.js",
      "**/tsconfig.json",
      "**/styleMock.ts",
      "**/fileMock.ts",
      "**/.turbo",
      "gql/graphql.ts",
      "dist/**/*",
      "**/*.snap",
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    files: ["**/*.{ts,tsx}"],
    extends: [importFlatConfigs.recommended, importFlatConfigs.typescript],
    plugins: {
      "no-only-tests": noOnlyTests,
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
        typescript: {},
      },
    },
    rules: {
      camelcase: [
        "error",
        {
          allow: ["w*Query$", "w*Fragment$", "w*Mutation$", "w*Document$"],
        },
      ],

      "consistent-return": "error",
      "import/no-extraneous-dependencies": "off",

      "import/extensions": [
        "error",
        "never",
        {
          json: "always",
        },
      ],

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
      "no-param-reassign": "error",
      "no-use-before-define": "off",
      "no-shadow": "off",
      "no-console": "error",
      "no-alert": "error",
      "prefer-promise-reject-errors": "off",
      "@typescript-eslint/no-deprecated": "error",
      "@typescript-eslint/no-use-before-define": "error",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-empty-function": "error",

      "@typescript-eslint/prefer-nullish-coalescing": [
        "error",
        {
          ignorePrimitives: {
            boolean: true,
          },
        },
      ],

      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],

      "no-underscore-dangle": [
        "error",
        {
          allow: ["__typename"],
        },
      ],

      "import/no-named-as-default": "off",
      "import/namespace": "off",
    },
  },
  prettierConfig,
);
