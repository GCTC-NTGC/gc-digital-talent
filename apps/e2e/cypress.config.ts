import { defineConfig } from "cypress";
const { verifyDownloadTasks } = require("cy-verify-downloads");

const extendedTimeout = 60000;

export default defineConfig({
  defaultCommandTimeout: process.env.CYPRESS_EXTEND_TIMEOUTS
    ? extendedTimeout
    : 8000,
  pageLoadTimeout: process.env.CYPRESS_EXTEND_TIMEOUTS
    ? extendedTimeout
    : 60000,
  requestTimeout: process.env.CYPRESS_EXTEND_TIMEOUTS ? extendedTimeout : 5000,
  responseTimeout: process.env.CYPRESS_EXTEND_TIMEOUTS
    ? extendedTimeout
    : 30000,
  retries: {
    runMode: 3,
  },
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    configFile: "cypress/reporters-config.json",
  },
  viewportWidth: 1920,
  viewportHeight: 1080,
  videoCompression: 15,
  chromeWebSecurity: true,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      on("task", verifyDownloadTasks);
      return require("./cypress/plugins/index.js")(on, config);
    },
    experimentalSessionAndOrigin: true,
    excludeSpecPattern: "**/examples/*.spec.js",
    baseUrl: "http://localhost:8000",
  },
});
