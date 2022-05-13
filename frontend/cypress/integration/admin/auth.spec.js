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
      // Creates alias: @gqlMeQuery
      aliasQuery(req, 'me')
    })

    cy.url().should('match', new RegExp(`^${ Cypress.config().baseUrl }/en/admin/dashboard$`))
    // Heading won't render until we know user details.
    cy.wait('@gqlMeQuery')
    cy.get('h1').contains('Welcome back,').should('exist').and('be.visible')
  }

  const showRestrictedPage = () => {
    // Don't be picky about heading size.
    cy.get('main :is(h1, h2, h3)').contains('not authorized').should('exist').and('be.visible')
  }

  context('Anonymous visitor', () => {
    it('prevents from seeing content on restricted pages', () => {
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

    it('successfully registers a new user', () => {
      const doLogin = () => {
        cy.intercept('POST', '/auth/register').as('registerUser')

        const randomInt = Math.floor(Math.random() * 10000)
        const name = 'Test User'
        const password = 'testpassword'
        const email = `test.user.${randomInt}@talent.test`

        cy.visit('/auth/register')
        cy.get('input#first_name').type(name)
        cy.get('input#last_name').type(name)
        cy.get('input#email').type(email)
        cy.get('input#password').type(password)
        cy.get('input#password_confirmation').type(password)
        cy.get('button').contains('Register').click()
        cy.wait('@registerUser')
          .its('response.statusCode').should('eq', 302)
      }

      const doAuthorization = () => {
        cy.intercept('POST', '/oauth/authorize').as('authUser')
        cy.get('button').contains('Login').click()
        cy.url().should('match', new RegExp(`^${ Cypress.config().baseUrl }/oauth/authorize`))
        cy.get('button').contains('Authorize').click()
        cy.wait('@authUser')
      }


      cy.logout()
      doLogin()
      // Complete the authorizations (only required with our local auth server)
      doAuthorization()

      onDashboard()
    })

    it('redirects app login page to auth login page', () => {
      cy.visit('/login')
      cy.url().should('equal', `${ Cypress.config().baseUrl }/auth/login`)
      cy.get('button').contains('Log in').should('exist').and('be.visible')
    })

    it('successfully logs in as existing admin user', () => {
      const initialPath = '/en/admin/skills'
      cy.visit(initialPath)
      cy.get('button').contains('Login')
        .should('be.visible')
      cy.get('button').contains('Login').click()
      cy.url().should('equal', `${ Cypress.config().baseUrl }/auth/login`)


      cy.fixture('users.json').then(users => {
        const user = users['admin']
        cy.get('input#email').type(user.email)
        cy.get('input#password').type(user.password)
      })

      cy.get('button').contains('Log in').click()

      cy.url().should('equal', Cypress.config().baseUrl + initialPath)
    })
  })

  context('Authenticated', () => {
    it('allows logout', () => {
      cy.login('admin')

      cy.visit('/admin')
      cy.get('button').contains('Logout').should('exist').and('be.visible')
      cy.get('button').contains('Logout').click()

      cy.get('button').contains('Logout').should('not.exist')
      cy.get('button').contains('Login').should('exist').and('be.visible')
    })

    it('redirects login form to admin', () => {
      cy.login('admin')

      cy.visit('/login')
      cy.url().should('not.equal', `${ Cypress.config().baseUrl }/auth/login`)
      onDashboard()
    })
  })
})
