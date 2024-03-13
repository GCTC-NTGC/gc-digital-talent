module.exports = {
  root: true,
  extends: ["@gc-digital-talent/eslint-config"],
  plugins: ["formatjs"],
  rules: {
    // this package does not have a translation script
    "formatjs/blocklist-elements": ["error", ["literal"]],
  },
};
