import baseConfig from "@gc-digital-talent/eslint-config/no-translation";

export default [
  ...baseConfig,
  {
    rules: {
      "import/no-unused-modules": (() => {
        // Trigger warning on CI only, because of performance issues locally
        if (process.env.CI) {
          return [
            1,
            {
              unusedExports: true,
              ignoreExports: ["src/index.{ts,tsx}"],
            },
          ];
        }
        return "off";
      })(),
    },
  },
];
