import formatjs from "eslint-plugin-formatjs";
import baseConfig from "./react.mjs";

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
