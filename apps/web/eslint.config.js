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
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["./tsconfig.json"],
        },
        alias: {
          map: [["~", "./src"]],
          extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs"],
        },
        node: true,
      },
    },
  },
];
