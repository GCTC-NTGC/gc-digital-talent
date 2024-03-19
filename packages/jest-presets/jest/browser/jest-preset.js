const path = require("path");

module.exports = {
  roots: ["<rootDir>"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePathIgnorePatterns: [
    "<rootDir>/test/__fixtures__",
    "<rootDir>/node_modules",
    "<rootDir>/dist",
  ],
  moduleNameMapper: {
    "^.+\\.(css|less)$": path.join(__dirname, "../../mocks/css.js"),
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [path.join(__dirname, "../../setup.js")],
};
