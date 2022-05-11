describe('Auth flows (development)', () => {
  context('Unauthenticated', () => {
    it('successfully registers a new user', () => {
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

      // Complete the authorizations (only required with our local auth server)
      cy.get('button').contains('Login').click()
      cy.url().should('match', new RegExp(`^${ Cypress.config().baseUrl }/oauth/authorize`))
      cy.get('button').contains('Authorize').click()

      cy.get('h1').contains('Pools').should('exist').and('be.visible')
    })

    it('redirects app login page to auth login page', () => {
      cy.visit('/login')
      cy.url().should('equal', `${ Cypress.config().baseUrl }/auth/login`)
      cy.get('button').contains('Log in').should('exist').and('be.visible')
    })

    it('successfully logs in as existing user', () => {
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
      cy.login()

      cy.visit('/login')
      cy.url().should('not.equal', `${ Cypress.config().baseUrl }/auth/login`)
      cy.get('h1').contains('Pools').should('exist').and('be.visible')
    })
  })
})
