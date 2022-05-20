import { aliasQuery } from '../utils/graphql-test-utils'

describe('Auth flows (development)', () => {
  // Prepare to intercept/detect GraphQL requests.

  // Helpers.
  const onHomeNoAuth = () => {
    cy.url().should('match', new RegExp(`^${ Cypress.config().baseUrl }/en/admin$`))
    cy.get('h1').contains('Home').should('exist').and('be.visible')
  }

  const onDashboard = () => {
    cy.intercept('POST', '/graphql', (req) => {
      // Creates alias: @gqlgetMeQuery
      aliasQuery(req, 'getMe')
    })

    cy.url().should('match', new RegExp(`^${ Cypress.config().baseUrl }/en/admin/dashboard$`))
    // Heading won't render until we know user details.
    cy.wait('@gqlgetMeQuery')
    cy.get('h1').contains('Welcome back,').should('exist').and('be.visible')
  }

  const showRestrictedPage = () => {
    // Don't be picky about heading size.
    cy.get('main :is(h1, h2, h3)').contains('not authorized').should('exist').and('be.visible')
  }

  context('Anonymous visitor', () => {
    it('prevents viewing content on restricted pages', () => {
      [
        '/en/admin/dashboard',
        '/en/admin/skills',
        '/en/admin/search-requests',
        '/en/admin/users',
        '/en/admin/classifications',
        '/en/admin/cmo-assets',
        '/en/admin/pools',
        '/en/admin/departments',
        '/en/admin/skill-families',
        '/en/admin/skills',
      ].forEach(restrictedPath => {
        cy.visit(restrictedPath)
        showRestrictedPage()
      })
    })

    // TODO: Enable this once we have interactive login enabled.
    it.skip('redirects app login page to auth login page', () => {
      cy.visit('/login')
      cy.url().should('contain', Cypress.config().authServerRoot + '/authorize')
    })

    // This test will only work on Chrome-based browsers, since visiting the
    // mock auth server requires violating same-origin policy, and this only
    // works on Chrome (and only because we've disabled it in cypress.json).
    // See: https://docs.cypress.io/guides/guides/web-security#Disabling-Web-Security
    it('successfully logs in as existing admin user', () => {
      const initialPath = '/en/admin/skills'
      cy.visit(initialPath)
      // Limit to nav because two login buttons on main page.
      cy.get('nav').within(() => {
        cy.findByRole('button', {name: 'Logout'})
          .should('not.exist')
        cy.findByRole('button', {name: 'Login'})
          .should('exist').and('be.visible')
          .click()
      })
//      cy.url().should('contain', Cypress.config().authServerRoot + '/authorize')
//
//
//      cy.fixture('users.json').then(users => {
//        const user = users['admin']
//        cy.get('input[name=username]').type(user.email)
//      })
//
//      cy.findByText('Sign-in').click()

      cy.url().should('equal', Cypress.config().baseUrl + initialPath)
      cy.get('nav').within(() => {
        cy.findByRole('button', {name: 'Login'})
          .should('not.exist')
        cy.findByRole('button', {name: 'Logout'})
          .should('exist').and('be.visible')
          .click()
      })
    })
  })

  context('Authenticated', () => {
    beforeEach(() => cy.login())
    it('allows logout', () => {
      cy.visit('/admin')
      cy.findByText('Logout').should('exist').and('be.visible')
      cy.findByText('Logout').click()

      cy.findByText('Logout').should('not.exist')
      cy.findByText('Login').should('exist').and('be.visible')
    })

    it('redirects login path to admin dashboard', () => {
      cy.visit('/login')
      onDashboard()
    })
  })
})
