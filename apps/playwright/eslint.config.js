import typescript from "@typescript-eslint/eslint-plugin";
import playwright from "eslint-plugin-playwright";
import typescriptParser from "@typescript-eslint/parser";
import baseConfig from "@gc-digital-talent/eslint-config/react";
const { configs: typescriptConfigs } = typescript;

export default [
  ...baseConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": typescript,
      playwright: playwright,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      ...typescriptConfigs.recommended.rules,
      ...playwright.configs["flat/recommended"].rules,
      "no-console": "warn",
      "playwright/expect-expect": [
        "error",
        {
          assertFunctionNames: ["assertError", "assertSuccess"],
        },
      ],
      "testing-library/prefer-screen-queries": "off",
    },
  },
];
