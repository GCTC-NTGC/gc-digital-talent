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

before(() => {
  cy.log('Need to add a custom command? Add it to `cypress/support/commands.js`')

  /* Tips
   * - custom commands may use the UI in a pinch, but ideally should not.
   *   Rather, they should use `cy.request()` as much as possible. This is
   *   faster. A test should exist to tests the UI itself, and so commands
   *   shouldn't need to drive the browser and make as many assertions.
   *   - Example: https://docs.cypress.io/api/cypress-api/custom-commands#Log-in-command-using-request
   */
})

// See: https://testing-library.com/docs/cypress-testing-library/intro/
import '@testing-library/cypress/add-commands'
import url from 'url'

Cypress.Commands.add('setLocale', (locale) => {
  window.localStorage.setItem('stored_locale', locale)
})

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
      // See: https://www.cypress.io/blog/2021/08/04/authenticate-faster-in-tests-cy-session-command/
      cy.session([email, password], () => {
        loginByPassword(email, password)
      })
  }
})

// Logs in with no user specified, assuming no login page.
// Works only when mock-oauth2-server.json has set interactiveLogin:FALSE
const loginNonInteractive = () => _login()

// Logs in by role, using email from `fixtures/users.json`.
// Works only when mock-oauth2-server.json has set interactiveLogin:TRUE
// Current options: admin
const loginByRole = (userRole = 'admin') => {
  cy.fixture('users.json').then(users => {
    const user = users[userRole]

    const authorizeReqOptions = {
      method: 'POST',
      form: true,
      body: {
        username: user.email
      },
    }
    _login(authorizeReqOptions)
  })
}

const _login = (authorizeReqOptions = {}) => {
  cy.request({ url: '/login', followRedirect: false }).then((resp) => {
    cy.wrap(resp.redirectedToUrl).as('oauth2AuthorizeUrl')
  })
  cy.get('@oauth2AuthorizeUrl').then((url) => {
    cy.request({ url: url, followRedirect: false, ...authorizeReqOptions }).then((resp) => {
      cy.wrap(resp.redirectedToUrl).as('appCallbackUrl')
    })
  })
  cy.get('@appCallbackUrl').then((url) => {
    cy.request({ url: url, followRedirect: false })
      .then(setLocalStorageTokensFromResponse)
  })
}

/**
 * Assuming "cy.request" was called with `{followRedirect: false}` grabs the
 * redirectedToUrl, confirms it has proper tokens and sets them in
 * localStorage.
 */
const setLocalStorageTokensFromResponse = (resp) => {
  const uri = url.parse(resp.redirectedToUrl, true)

  // Confirm we have token parts from query params.
  expect(uri.query).to.have.property('id_token')
  expect(uri.query).to.have.property('access_token')
  expect(uri.query).to.have.property('refresh_token')

  // Store tokens in localStorage.
  window.localStorage.setItem('id_token', uri.query.id_token)
  window.localStorage.setItem('access_token', uri.query.access_token)
  window.localStorage.setItem('refresh_token', uri.query.refresh_token)
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

// Check if a toast is displayed
Cypress.Commands.add('expectToast', (text) => {
  cy.findAllByRole("alert")
    .each(item => {
      cy.wrap(item)
        .parent()
        .findByText(text)
        .should("exist");
    });
})
