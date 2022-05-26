import { aliasQuery } from '../../support/graphql-test-utils'

describe('Auth flows (development)', () => {
  // Prepare to intercept/detect relevant GraphQL requests.
  beforeEach(() => {
    cy.intercept('POST', '/graphql', (req) => {
      // Creates aliases for use later.
      // E.g., cy.wait('@gqlgetMeQuery')
      aliasQuery(req, 'getMe')
      aliasQuery(req, 'me')
    })
  })

  context('Anonymous visitor', () => {

    it('prevents viewing content on restricted pages', () => {
      const onRestrictedPage = () => {
        sideMenuLoaded()
        // Don't be picky about heading size.
        cy.findByRole('heading', { name: /not authorized/ })
          .should('exist').and('be.visible')
      }

      const sideMenuLoaded = () => {
        cy.wait('@gqlgetMeQuery')
      }

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
        onRestrictedPage()
      })
    })

    it('redirects app login page to auth login page', () => {
      cy.request({ url: '/login', followRedirect: false }).then((req) => {
        expect(req.redirectedToUrl)
          .to.include(Cypress.config().authServerRoot + '/authorize')
      })
    })

  })

  context('Login', () => {

    it('sets JWT tokens in local storage', () => {
      expect(localStorage.getItem('id_token')).not.to.exist
      expect(localStorage.getItem('access_token')).not.to.exist
      expect(localStorage.getItem('refresh_token')).not.to.exist

      cy.login('admin').then(() => {
        expect(localStorage.getItem('id_token')).to.exist
        expect(localStorage.getItem('access_token')).to.exist
        expect(localStorage.getItem('refresh_token')).to.exist
      })
    })

    it('sets cookies on login redirect page', () => {
      cy.getCookie('api_session').should('not.exist')
      cy.getCookie('XSRF-TOKEN').should('not.exist')
      cy.request({ url: '/login', followRedirect: false }).then(() => {
        cy.getCookie('api_session').should('exist')
        cy.getCookie('XSRF-TOKEN').should('exist')
      })
    })

    // TODO: write this
    // See: https://www.oauth.com/playground/oidc.html
    it.skip('should fail if the state value is tampered with', () => {
    })

    // Visiting the mock auth server requires violating same-origin security
    // policies that Cypress isn't intended to do, and so this test will fail
    // (except under special conditions that we don't run by default)
    // Requires chromeWebSecurity:false (See main README)
    it('succeeds for an existing admin user', () => {
      const initialPath = '/en/admin/skills'
      cy.visit(initialPath)
      // Limit to nav because two login buttons on main page.
      cy.get('nav').within(() => {
        cy.findByRole('button', {name: 'Logout'})
          .should('not.exist')
        cy.findByRole('link', {name: 'Login'})
          .should('exist').and('be.visible')
          .click()
      })
      cy.url().should('contain', Cypress.config().authServerRoot + '/authorize')

      cy.fixture('users.json').then(users => {
        const user = users['admin']
        cy.get('input[name=username]').type(user.email)
      })

      cy.findByText('Sign-in').click()

      cy.url().should('equal', Cypress.config().baseUrl + initialPath)
      cy.get('nav').within(() => {
        cy.findByRole('link', {name: 'Login'})
          .should('not.exist')
        cy.findByRole('button', {name: 'Logout'})
          .should('exist').and('be.visible')
      })
    })

  })

  context('Authenticated', () => {
    beforeEach(() => cy.login('admin'))

    it('redirects by default to dashboard', () => {
      const onDashboard = () => {
        cy.url().should('match', new RegExp(`^${ Cypress.config().baseUrl }/en/admin/dashboard$`))
        // Heading won't render until we know user details.
        userDataLoaded()
        cy.findByRole('heading', { name: /^Welcome back,/ })
          .should('exist').and('be.visible')
      }

      const userDataLoaded = () => {
        cy.wait('@gqlmeQuery')
      }

      cy.visit('/admin')
      onDashboard()
    })

    it('performs logout and removes token data from local storage', () => {
      cy.visit('/admin')
      cy.findByRole('button', { name: 'Logout' }).as('logout')
      cy.get('@logout')
        .should('exist').and('be.visible')
        .click().then(() => {
          expect(localStorage.getItem('id_token')).not.to.exist
          expect(localStorage.getItem('access_token')).not.to.exist
          expect(localStorage.getItem('refresh_token')).not.to.exist
        })

      cy.get('@logout')
        .should('not.exist')
      cy.findByRole('link', { name: 'Login' })
        .should('exist').and('be.visible')
    })

  })
})
