module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    "./index.js",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:jsx-a11y/recommended",
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
  plugins: ["react", "react-hooks", "formatjs", "jsx-a11y"],
  rules: {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "formatjs/no-id": "off",
    "formatjs/enforce-id": [
      "error",
      {
        idInterpolationPattern: "[sha512:contenthash:base64:6]",
        idWhitelist: ["\\."],
      },
    ],
    "formatjs/enforce-description": ["error", "literal"],
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
    "@typescript-eslint/no-restricted-types": [
      "warn",
      {
        types: {
          "React.FunctionComponent":
            "https://github.com/facebook/create-react-app/pull/8177",
          "React.FC": "https://github.com/facebook/create-react-app/pull/8177",
        },
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
    "react/function-component-definition": "off",
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["lodash", "!lodash/"],
            message:
              "Please import the individual function, not the entire library.",
          },
          {
            group: ["date-fns", "date-fns-tz", "!date-fns/", "!date-fns-tz/"],
            message:
              "Please import the individual function, not the entire library.",
          },
          {
            group: [
              "@heroicons/react/24/outline",
              "@heroicons/react/24/solid",
              "@heroicons/react/20/outline",
              "@heroicons/react/20/solid",

              "!@heroicons/react/24/outline/",
              "!@heroicons/react/24/solid/",
              "!@heroicons/react/20/outline/",
              "!@heroicons/react/20/solid/",
            ],
            message: "Please import the individual icons, not the entire set.",
          },
          {
            group: ["*.jpg", "*.png"],
            message: "Please use WebP as the image format.",
          },
          {
            group: ["~/pages"],
            message: "Please move to central location.",
          },
        ],
      },
    ],
    "react/forbid-elements": [1, { forbid: ["a", "hr"] }],
    "no-restricted-syntax": [
      "error",
      {
        selector: "Literal[value=/Indigenous Apprenticeship Program/i]",
        message:
          "The name of the program is IT Apprenticeship Program for Indigenous Peoples.",
      },
      {
        selector: "CallExpression[callee.name='useLocale']",
        message: "Please use getLocale instead.",
      },
    ],
  },
};
