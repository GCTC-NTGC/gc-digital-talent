import { setUpCommonGraphqlIntercepts } from '../../support/graphql-test-utils'

describe('Auth flows (development)', () => {
  // Helpers
  const onAuthLoginPage = () => {
    cy.url().should('contain', Cypress.config().authServerRoot + '/authorize')
  }

  const loginViaUI = (role) => {
    cy.fixture('users.json').then(users => {
      const user = users[role]
      cy.get('input[name=username]').type(user.email)
    })
    cy.findByText('Sign-in').click()
  }

  // Prepare to intercept/detect relevant GraphQL requests.
  beforeEach(() => {
    setUpCommonGraphqlIntercepts()
  })

  context('Anonymous visitor', () => {

    it('redirects restricted pages to login', () => {
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
        onAuthLoginPage()
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

    it('succeeds for an existing admin user', () => {
      cy.visit('/admin')
      // Click login button.
      // Limit to nav because two login buttons on main page.
      cy.get('nav').within(() => {
        cy.findByRole('button', { name: 'Logout' })
          .should('not.exist')
        cy.findByRole('link', { name: 'Login' })
          .should('exist').and('be.visible')
          .click()
      })

      onAuthLoginPage()
      loginViaUI('admin')

      cy.url().should('equal', Cypress.config().baseUrl + '/en/admin/dashboard')
      // Confirm login status via button state.
      cy.get('nav').within(() => {
        cy.findByRole('link', { name: 'Login' })
          .should('not.exist')
        cy.findByRole('button', { name: 'Logout' })
          .should('exist').and('be.visible')
      })
    })

    it('redirects back to referring page after login', () => {
      const initialPath = '/en/admin/users'
      cy.visit(initialPath)

      onAuthLoginPage()
      loginViaUI('admin')

      cy.url().should('equal', Cypress.config().baseUrl + initialPath)
    })

  })

  context('Authenticated as admin', () => {
    beforeEach(() => cy.login('admin'))

    it('redirects by default to dashboard', () => {
      const onDashboard = () => {
        cy.url().should('match', new RegExp(`^${Cypress.config().baseUrl}/en/admin/dashboard$`))
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
      cy.findByRole('button', { name: 'Logout' }).as('logoutToggle')
      cy.get('@logoutToggle')
        .should('exist').and('be.visible')
        .click().then(() => {

          cy.findByRole('dialog', { name: 'Logout' }).as('logoutModal');
          cy.get('@logoutModal')
            .should('exist').and('be.visible')
            .findByRole('button', { name: 'Logout' }).as('logoutBtn');

          cy.get('@logoutBtn')
            .should('exist').and('be.visible')
            .click().then(() => {
              expect(localStorage.getItem('id_token')).not.to.exist
              expect(localStorage.getItem('access_token')).not.to.exist
              expect(localStorage.getItem('refresh_token')).not.to.exist
            });
        });

      cy.get('@logoutToggle')
        .should('not.exist')
      cy.findByRole('link', { name: 'Login' })
        .should('exist').and('be.visible')
    })

  })

  context('Authenticated as applicant', () => {
    beforeEach(() => cy.login('applicant'))

    it('displays a not authorized message if logged in without the admin role', () => {
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
        cy.contains('not authorized');
      });
    })

  })
})
