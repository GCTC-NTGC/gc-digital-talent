module.exports = {
  root: true,
  extends: [
    "@gc-digital-talent/eslint-config",
    "plugin:playwright/recommended"
  ],
  ignorePatterns: ["tsconfig.json", "test-results/**", "playwright-report/**", ".auth/**"],
  rules: {
    "playwright/expect-expect": [
      "error",
      {
        "assertFunctionNames": ["assertError", "assertSuccess"]
      }
    ]
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: [__dirname],
      },
    },
  },
};
