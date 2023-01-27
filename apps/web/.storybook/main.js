const path = require("path");
const main = require("storybook-helpers/main");

const isMerged = (process.env.MERGE_STORYBOOKS === 'true');

const basePath = path.resolve(__dirname, "../");

const config = main(basePath)
if (isMerged) {
  config.stories.push([
    { '../../frontend/common/src/': '**/*.stories.@(js|jsx|ts|tsx|mdx)' }
  ])
}

module.exports = config;
