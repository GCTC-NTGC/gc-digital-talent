import playwright from "eslint-plugin-playwright";
import baseConfig from "@gc-digital-talent/eslint-config/react";

export default [
  ...baseConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      playwright: playwright,
    },
    rules: {
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
