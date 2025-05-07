// @ts-check

import react from "eslint-plugin-react";
import baseConfig from "./index.mjs";
import globals from "globals";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import formatjs from "eslint-plugin-formatjs";

export default [
  ...baseConfig,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  jsxA11Y.flatConfigs.recommended,
  // @ts-ignore
  formatjs.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
      },
    },
    plugins: { react, "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
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
      "formatjs/enforce-placeholders": [
        "error",
        {
          ignoreList: [
            "cite",
            "emphasize",
            "gray",
            "strong",
            "hidden",
            "primary",
            "red",
            "heavyPrimary",
            "heavyRed",
            "heavySecondary",
            "heavyWarning",
          ],
        },
      ],
      // TODO: Turn on and fix in in #12832
      "formatjs/no-multiple-plurals": "off",
      "formatjs/no-multiple-whitespaces": "off",
      "formatjs/prefer-pound-in-plural": "off",
      "formatjs/enforce-plural-rules": "off",

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
      // "react-hooks/rules-of-hooks": "error",
      // "react-hooks/exhaustive-deps": [
      //   "error",
      //   {
      //     additionalHooks: "(useDeepCompareEffect)",
      //   },
      // ],
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
        "error",
        {
          types: {
            "React.FunctionComponent":
              "https://github.com/facebook/create-react-app/pull/8177",
            "React.FC":
              "https://github.com/facebook/create-react-app/pull/8177",
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
              group: [
                "lodash/isArray",
                "lodash/flatMap",
                "lodash/groupBy",
                "lodash/upperCase",
                "lodash/head",
                "lodash/reverse",
                "lodash/isNumber",
                "lodash/isObject",
                "lodash/isString",
              ],
              message: "Please use the native javascript function instead.",
            },
            {
              group: ["date-fns", "!date-fns/"],
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
              message:
                "Please import the individual icons, not the entire set.",
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
      "react/forbid-elements": [
        1,
        {
          forbid: ["a", "hr"],
        },
      ],
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
  },
  {
    files: ["**/*.stories.ts*", "**/*.test.ts*"],
    rules: {
      "formatjs/no-literal-string-in-jsx": "off",
    },
  },
];
