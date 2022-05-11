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
  // Ensure admin user exists for other tests.
  cy.fixture('users.json').then(users => {
    const user = users['admin']
    // Don't fail out if user already exists.
    const strictFail = false
    cy.register(user.first, user.last, user.email, user.password, strictFail)
  })

  // Don't go into tests with any persistent state
  cy.clearCookies()
  cy.clearLocalStorage()
})

// Alternatively you can use CommonJS syntax:
// require('./commands')

require('cypress-terminal-report/src/installLogsCollector')()
