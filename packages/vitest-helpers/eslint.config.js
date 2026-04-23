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
    files: ["**/*.{ts,tsx,mts}"],
    rules: {
      "import/no-unused-modules": (() => {
        // Trigger warning on CI only, because of performance issues locally
        if (process.env.CI) {
          return [
            1,
            {
              unusedExports: true,
              ignoreExports: ["src/index.ts", "src/config/index.ts"],
            },
          ];
        }
        return "off";
      })(),
    },
  },
  {
    files: ["src/config/**/*.ts"],
    rules: {
      "import/extensions": ["error", "ignorePackages", { ts: "always" }],
    },
  },
];
