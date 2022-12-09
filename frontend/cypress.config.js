const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultCommandTimeout: 8000,
  pageLoadTimeout: 60000,
  requestTimeout: 5000,
  responseTimeout: 30000,
  retries: {
    runMode: 3,
  },
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'cypress/reporters-config.json',
  },
  viewportWidth: 1920,
  viewportHeight: 1080,
  videoCompression: 15,
  chromeWebSecurity: true,
  authServerRoot: 'http://localhost:8000/oxauth',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    experimentalSessionAndOrigin: true,
    excludeSpecPattern: '**/examples/*.spec.js',
    baseUrl: 'http://localhost:8000',
  },
})
