const path = require('path');

module.exports = {
  root: true,
  extends: ["custom"],
  rules: {
    // Ignore stories for unused modules
    "import/no-unused-modules": [1, { unusedExports: true, ignoreExports: [path.join(__dirname, "./src/**/*.stories.{ts,tsx}")] }],
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: [__dirname],
      },
    },
  },
};
