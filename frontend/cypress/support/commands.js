// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('expireAppSession', () => {
  window.localStorage.removeItem('refresh_token')
  window.localStorage.removeItem('id_token')
  window.localStorage.removeItem('access_token')
})

Cypress.Commands.add('discardLaravelCookie', () => {
  cy.clearCookie('laravel_session')
}

Cypress.Commands.add('discardIdentityProviderCookie', () => {
  cy.clearCookie('api_session')
})

Cypress.Commands.add('logout', () => {
  cy.expireAppSession()
  // These are not currently done as part of logout in UI.
  // This purging perhaps could be added later, in order for user to be able to
  // get to login screen again, but for now, tests should keep parity with UI.
  //cy.discardLaravelCookie()
  //cy.discardIdentityProviderCookie()
})
