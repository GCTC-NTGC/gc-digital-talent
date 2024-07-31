module.exports = {
  root: true,
  extends: [
    "@gc-digital-talent/eslint-config",
    "plugin:playwright/recommended"
  ],
  ignorePatterns: ["tsconfig.json", "test-results/**", "playwright-report/**", ".auth/**"],
  rules: {
    "@typescript-eslint/no-floating-promises": "error",
    "playwright/expect-expect": [
      "error",
      {
        "assertFunctionNames": ["assertError", "assertSuccess"]
      }
    ]
  },
  parserOptions: {
    project: "./tsconfig.json"
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: [__dirname],
      },
    },
  },
};
