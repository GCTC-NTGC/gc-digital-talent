module.exports = {
  root: true,
  extends: ["custom"],
  plugins: ["formatjs"],
  rules: {
    // this package does not have a translation script
    "formatjs/blocklist-elements": ["error", ["literal"]],
    // This package does not contain stories
    "import/no-unused-modules": [1, { unusedExports: true, ignoreExports: ["src/index.{ts,tsx}"] }],
  },
};
