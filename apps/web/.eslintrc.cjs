module.exports = {
  root: true,
  extends: ["@gc-digital-talent/eslint-config/react"],
  settings: {
    "import/resolver": {
      typescript: {
        project: [__dirname],
      },
    },
  },
  rules: {
    "@typescript-eslint/no-misused-promises": "off",
    "import/no-unused-modules": (() => {
      // Trigger warning on CI only, because of performance issues locally
      if (process.env.CI) {
        return [
          1,
          {
            unusedExports: true,
            ignoreExports: ["src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
          },
        ];
      }
      return "off";
    })(),
  },
};
