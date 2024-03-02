module.exports = {
  root: true,
  extends: [
    "@gc-digital-talent/eslint-config",
    "plugin:playwright/recommended"
  ],
  ignorePatterns: ["tsconfig.json"],
  settings: {
    "import/resolver": {
      typescript: {
        project: [__dirname],
      },
    },
  },
};
