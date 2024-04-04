module.exports = {
  root: true,
  extends: ["@gc-digital-talent/eslint-config/react"],
  settings: {
    "import/resolver": {
      typescript: {
        project: [__dirname],
      },
    },
  },
};
