module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    "airbnb",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
  },
  ignorePatterns: [
    "index.js",
    ".eslintrc",
    ".eslintrc.js",
    "generated.ts",
    "webpack.*.js",
  ],
  plugins: [
    "prettier",
    "react",
    "react-hooks",
    "@typescript-eslint",
    "formatjs",
    "jsx-a11y",
    "import"
  ],
  rules: {
    "formatjs/no-id": "off",
    "formatjs/enforce-id": [
      "error",
      {
        idInterpolationPattern: "[sha512:contenthash:base64:6]",
        idWhitelist: ["\\."],
      },
    ],
    camelcase: "warn",
    "consistent-return": "warn",
    "import/no-extraneous-dependencies": "off",
    "import/extensions": ["warn", "never", { json: "always" }],
    "react/display-name": "off",
    "react/prop-types": "off",
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".jsx", ".tsx"],
      },
    ],
    "react/jsx-props-no-spreading": "off",
    "react/require-default-props": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        additionalHooks: "(useDeepCompareEffect)",
      },
    ],
    "jsx-a11y/label-has-associated-control": [
      2,
      {
        labelComponents: ["CustomInputLabel"],
        labelAttributes: ["label"],
        controlComponents: ["CustomInput"],
        depth: 3,
      },
    ],
    "no-param-reassign": "warn",
    "jsx-a11y/no-noninteractive-element-to-interactive-role": [
      "error",
      {
        ul: [
          "listbox",
          "menu",
          "menubar",
          "radiogroup",
          "tablist",
          "tree",
          "treegrid",
        ],
        ol: [
          "listbox",
          "menu",
          "menubar",
          "radiogroup",
          "tablist",
          "tree",
          "treegrid",
          "progressbar",
        ],
        li: ["menuitem", "option", "row", "tab", "treeitem"],
        table: ["grid"],
        td: ["gridcell"],
      },
    ],
    "@typescript-eslint/no-empty-function": "warn",
    "no-use-before-define": "off",
    "@typescript-eslint/ban-types": "warn",
    "@typescript-eslint/no-use-before-define": "warn",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "error",
    "react/function-component-definition": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      typescript: {
        "alwaysTryTypes": true,
        "project": [
          "apps/*/tsconfig.json",
          "frontend/*/tsconfig.json",
          "packages/*/tsconfig.json",
        ]
      },
    },
  },
};
