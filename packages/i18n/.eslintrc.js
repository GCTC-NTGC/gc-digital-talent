module.exports = {
  root: true,
  extends: ["custom"],
  rules: {
    "import/no-unused-modules": [1, { unusedExports: true, ignoreExports: ["src/index.{ts,tsx}"] }],
  }
};
