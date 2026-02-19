import baseConfig from "@gc-digital-talent/eslint-config/no-translation";

export default [
  ...baseConfig,
  {
    files: ["src/index.tsx"],
    rules: {
      "import/extensions": "off",
    },
  },
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
              ignoreExports: ["src/index.{ts,tsx}"],
            },
          ]
        : "off",
    },
  },
];
