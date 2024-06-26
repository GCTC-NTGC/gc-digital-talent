module.exports = {
  root: true,
  extends: ["@gc-digital-talent/eslint-config/react"],
  rules: {
    "import/no-unused-modules": (() => {
      // Trigger warning on CI only
      if (process.env.CI) {
        return [
          1,
          {
            unusedExports: true,
            ignoreExports: ["index.ts", "main.ts"],
          },
        ];
      }

      return "off";
    })(),
  },
};
