import playwright from "eslint-plugin-playwright";
import baseConfig from "@gc-digital-talent/eslint-config";

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
      "testing-library/no-node-access": "off",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ["test-results/**", "playwright-report/**", ".auth/**"],
  },
];
