module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    "./index.js",
    "plugin:react/recommended",
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
  plugins: [
    "react",
    "react-hooks",
    "formatjs",
    "jsx-a11y",
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
      {
        name: "jpg",
        message: "Please use WebP as the image format.",
      },
      {
        name: "png",
        message: "Please use WebP as the image format.",
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
        message: "Please use getLocale instead."
      }
    ],
  },
};
