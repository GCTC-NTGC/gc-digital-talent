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

// See: https://testing-library.com/docs/cypress-testing-library/intro/
import '@testing-library/cypress/add-commands'

Cypress.Commands.add('login', (...args) => {
  let userRole, email, password, rest
  switch (args.length) {
    // If no arg, assume we're using non-interactive login for admin user.
    case 0:
      loginNonInteractive()
      break
    // If arg provided, assume it's a role.
    case 1:
      [userRole, ...rest] = args
      loginByRole(userRole)
      break
    // No-op for password login with our mock server.
    case 2:
    default:
      [email, password] = args
      loginByPassword(email, password)
  }
})

// Logs in with no user specified, assuming no login page.
// Works only when mock-oauth2-server.json has set interactiveLogin:FALSE
// TODO: Get this working without browser using cy.request().
const loginNonInteractive = () => {
  cy.intercept('POST', '/graphql').as('anyGraphQL')
  cy.visit('/login')
  cy.wait('@anyGraphQL')
}

// Logs in by role, using email from `fixtures/users.json`.
// Works only when mock-oauth2-server.json has set interactiveLogin:TRUE
// Current options: admin
const loginByRole = (userRole = 'admin') => {
  cy.fixture('users.json').then(users => {
    const user = users[userRole]

    cy.request('/login', {followRedirect: false}).then((data) => {
      const resp = data.allRequestResponses[0]
      const redirect = resp['Response Headers']['location']
      const cookieHeaders = resp['Response Headers']['set-cookie']
      cookieHeaders.forEach(cookieHeader => {
        let [cookieName, cookieValue] = cookieHeader.split(';')[0].split('=')
        cy.setCookie(cookieName, cookieValue)
      })
      cy.request({
        method: 'POST',
        followRedirect: false,
        url: redirect,
        form: true,
        body: {
          username: user.email,
        },
      }).then((data) => {
        const resp = data.allRequestResponses[0]
        const redirect = resp['Response Headers']['location']
        cy.request(redirect, {followRedirect: false}).then((data) => {
          const resp = data.allRequestResponses[0]
          const redirect = resp['Response Headers']['location']
          const urlObj = new URL(redirect)
          const urlParams = new URLSearchParams(urlObj.search)
          window.localStorage.setItem('id_token', urlParams.get('id_token'))
          window.localStorage.setItem('access_token', urlParams.get('access_token'))
          window.localStorage.setItem('refresh_token', urlParams.get('refresh_token'))
        })
      })
    })
  })
}

// No-op placeholder function to document how our mock-oauth2-server works.
const loginByPassword = (email, password) => {
  throw new Error('Our mock server does not require login via email and password')
}

// Performs logout actions that the app would normally perform on its own.
Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('refresh_token')
  window.localStorage.removeItem('id_token')
  window.localStorage.removeItem('access_token')
})
