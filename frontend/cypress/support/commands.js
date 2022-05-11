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

Cypress.Commands.add('register', (firstName, lastName, email, password, doAuthorization = true) => {
  cy.intercept('POST', '/auth/register').as('registerUser')

  cy.visit('/auth/register')
  cy.get('input#first_name').type(firstName)
  cy.get('input#last_name').type(lastName)
  cy.get('input#email').type(email)
  cy.get('input#password').type(password)
  cy.get('input#password_confirmation').type(password)
  cy.get('button').contains('Register').click()
  cy.wait('@registerUser')
    .its('response.statusCode').should('eq', 302)

  if (doAuthorization) {
    cy.get('button').contains('Login').click()
    cy.get('button').contains('Authorize').click()
  }
})

Cypress.Commands.add('registerWithAuthorization', (firstName, lastName, email, password) => {
  cy.register(firstName, lastName, email, password, strictFail, true)
})

Cypress.Commands.add('registerWithNoAuthorization', (firstName, lastName, email, password) => {
  cy.register(firstName, lastName, email, password, strictFail, false)
})
