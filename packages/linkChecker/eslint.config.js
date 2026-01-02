import baseConfig from "@gc-digital-talent/eslint-config/react";
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
      "import/no-unused-modules": (() => {
        // Trigger warning on CI only, because of performance issues locally
        if (process.env.CI) {
          return [
            1,
            {
              unusedExports: true,
            },
          ];
        }
        return "off";
      })(),
      // Allow underscores for env vars and global keys
      "no-underscore-dangle": "off",
    },
  },
];
