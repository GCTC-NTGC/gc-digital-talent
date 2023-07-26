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
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
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
    "tsconfig.json",
    "CssStub.js",
    ".turbo",
    "dist/**",
  ],
  plugins: [
    "react",
    "react-hooks",
    "import",
    "@typescript-eslint",
    "formatjs",
    "jsx-a11y",
    "turbo",
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
    "import/no-unused-modules": [1, { unusedExports: true }],
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
    "@typescript-eslint/ban-types": [
      "warn",
      {
        types: {
          "React.FunctionComponent":
            "https://github.com/facebook/create-react-app/pull/8177",
          "React.FC": "https://github.com/facebook/create-react-app/pull/8177",
        },
      },
    ],
    "@typescript-eslint/no-use-before-define": "warn",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "error",
    "react/function-component-definition": "off",
    "no-restricted-imports": [
      "error",
      {
        name: "lodash",
        message:
          "Please import the individual function, not the entire library.",
      },
      {
        name: "date-fns",
        message:
          "Please import the individual function, not the entire library.",
      },
      {
        name: "date-fns-tz",
        message:
          "Please import the individual function, not the entire library.",
      },
      {
        name: "@heroicons/react/24/outline",
        message: "Please import the individual icons, not the entire set.",
      },
      {
        name: "@heroicons/react/24/solid",
        message: "Please import the individual icons, not the entire set.",
      },
      {
        name: "@heroicons/react/20/outline",
        message: "Please import the individual icons, not the entire set.",
      },
      {
        name: "@heroicons/react/20/solid",
        message: "Please import the individual icons, not the entire set.",
      },
    ],
    "react/forbid-elements": [1, { forbid: ["a"] }],
    "no-restricted-syntax": [
      "error",
      {
        selector: "Literal[value=/Indigenous Apprenticeship Program/i]",
        message:
          "The name of the program is IT Apprenticeship Program for Indigenous Peoples.",
      },
    ],
  },
  settings: {
    "import/extensions": [".ts", ".tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        project: [__dirname],
      },
    },
  },
};
