import formatjs from "eslint-plugin-formatjs";
import baseConfig from "@gc-digital-talent/eslint-config/react";
import plugin from "eslint-plugin-react";
export default [
  ...baseConfig,
  {
    plugins: { formatjs },
    rules: {
      // this package does not have a translation script
      "formatjs/blocklist-elements": ["error", ["literal"]],
    },
  },
];
