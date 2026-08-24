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
      // fake-data is the one package allowed to import the full schema object
      // types from "@gc-digital-talent/graphql/schema-types".
      "no-restricted-imports": "off",
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
