const path = require('path');

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
