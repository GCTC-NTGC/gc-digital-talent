import baseConfig from "@gc-digital-talent/eslint-config/no-translation";

export default [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "import/no-unused-modules": process.env.CI
        ? [
            1,
            {
              unusedExports: true,
              ignoreExports: [
                "src/index.{ts,tsx}",
                "src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
                "vitest.config.ts",
              ],
            },
          ]
        : "off",
    },
  },
];
