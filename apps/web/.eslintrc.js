module.exports = {
  root: true,
  extends: ["custom"],
  settings: {
    "import/resolver": {
      typescript: {
        project: [__dirname],
      },
    },
  },
};
