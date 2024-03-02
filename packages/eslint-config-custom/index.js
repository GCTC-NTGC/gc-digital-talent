module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "airbnb",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "prettier",
  ],
  ignorePatterns: [
    "index.js",
    ".eslintrc",
    ".eslintrc.js",
    "webpack.*.js",
    "tsconfig.json",
    "CssStub.js",
    ".turbo",
    "dist/**",
  ],
  overrides: [
    {
      files: ["**/?(*.)+(test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
  plugins: [
    "import",
    "@typescript-eslint",
    "turbo"
  ],
  rules: {
    camelcase: ["warn", {
      allow: ["\w*Query$", "\w*Fragment$", "\w*Mutation$", "\w*Document$"]
    }],
    "consistent-return": "warn",
    "import/no-extraneous-dependencies": "off",
    "import/extensions": ["warn", "never", { json: "always" }],
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        distinctGroup: false,
        groups: [
          "builtin",
          "external",
          "unknown",
          "internal",
          ["parent", "sibling"],
          "index",
        ],
        pathGroups: [
          {
            pattern: "@gc-digital-talent/**",
            group: "unknown",
          },
          {
            pattern: "~/**",
            group: "internal",
          },
        ],
        pathGroupsExcludedImportTypes: ["@gc-digital-talent/**"],
      },
    ],
    "no-param-reassign": "warn",
    "no-use-before-define": "off",
    "no-shadow": "off",
    "@typescript-eslint/no-use-before-define": "warn",
    "@typescript-eslint/no-shadow": "error",
    "@typescript-eslint/no-empty-function": "warn",
  },
  settings: {
    "import/extensions": [".ts", "tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        project: [__dirname]
      }
    }
  }
}
