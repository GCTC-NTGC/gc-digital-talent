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
})

Cypress.Commands.add('discardIdentityProviderCookie', () => {
  cy.clearCookie('api_session')
})

// TODO: Convert to using cy.request instead of UI.
const loginByPassword = (email, password) => {
  cy.visit('/login')
  cy.get('input#email').type(email)
  cy.get('input#password').type(password)
  cy.get('button').contains('Log in').click()
}

const loginByRole = (userRole = 'admin') => {
  cy.fixture('users.json').then(users => {
    const user = users[userRole]
    loginByPassword(user.email, user.password)
  })
}

Cypress.Commands.add('login', (...args) => {
  let userRole, email, password, rest
  switch (args.length) {
    // If no arg, use default arg.
    case 0:
    case 1:
      [userRole, ...rest] = args
      loginByRole(userRole)
      break
    // 2+ args, use this strategy.
    case 2:
    default:
      [email, password, ...rest] = args
      loginByPassword(email, password)
  }
})

Cypress.Commands.add('logout', () => {
  cy.expireAppSession()
  // These are not currently done as part of logout in UI.
  // This purging perhaps could be added later, in order for user to be able to
  // get to login screen again, but for now, tests should keep parity with UI.
  //cy.discardLaravelCookie()
  //cy.discardIdentityProviderCookie()
})

// TODO: Convert to using cy.request instead of UI.
Cypress.Commands.add('register', (firstName, lastName, email, password, strictFail = true) => {
  const authorize = () => {
    cy.get('button').contains('Login').click()
    cy.get('button').contains('Authorize').click()
  }

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

  cy.url().then(url => {
    // If user creattion fails, continue along.
    // Helpful when creating a user that may already exist.
    if (!strictFail) {
      if (!url.includes('/auth/register')) {
        authorize()
      }
    } else {
      authorize()
    }
  })
})
