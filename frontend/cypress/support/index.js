// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
before(() => {
  cy.log('Need to run something before each test file? Add it to `cypress/support/index.js`')

  /* Tips
   * - Using `before()` and `beforeEach()` is helpful, as they act the same as
   *   within a spec file.  They allow Cypress commands here to run in the
   *   context of a Cypress test.
   */
})

// Alternatively you can use CommonJS syntax:
// require('./commands')

require('cypress-terminal-report/src/installLogsCollector')()
