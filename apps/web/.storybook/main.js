const path = require("path");
const main = require("storybook-helpers/main");

const basePath = path.resolve(__dirname, "../");

// if (isMerged) {
//   config.stories.push([
//     { '../../frontend/common/src/': '**/*.stories.@(js|jsx|ts|tsx|mdx)' }
//   ])
// }

module.exports = main();
