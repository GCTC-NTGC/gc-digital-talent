module.exports = {
  roots: ["resources/js", "tests"],

  // Jest transformations -- this adds support for TypeScript
  // using ts-jest
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  collectCoverage: true,
  coverageReporters: ["json", "html"],
  collectCoverageFrom: [
    "resources/js/**/*.{js,jsx,ts,tsx}",
    "!<rootDir>/node_modules/",
  ],

  // Module file extensions for importing
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
