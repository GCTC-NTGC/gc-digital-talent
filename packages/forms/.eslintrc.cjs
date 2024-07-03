module.exports = {
  root: true,
  extends: ["@gc-digital-talent/eslint-config/react"],
  plugins: ["formatjs"],
  rules: {
    // this package does not have a translation script
    "formatjs/blocklist-elements": ["error", ["literal"]],
    "import/no-unused-modules": (() => {
      // Trigger warning on CI only, because of performance issues locally
      if (process.env.CI) {
        return [
          1,
          {
            unusedExports: true,
            ignoreExports: [
              "src/index.{ts,tsx}",
              "src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
            ],
          },
        ];
      }

      return "off";
    })(),
  },
};
