/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // Register the log collector for logging activity to terminal.
  const reporterOptions = {
    // When to print terminal logs for tests.
    // Options: onFail, always, never
    printLogsToConsole: "onFail",
  };
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  require("cypress-terminal-report/src/installLogsPrinter")(
    on,
    reporterOptions,
  );
};
