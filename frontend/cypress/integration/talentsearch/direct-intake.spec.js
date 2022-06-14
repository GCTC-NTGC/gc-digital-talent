describe("Talentsearch Direct Intake Page", () => {
  // Helpers
  const onAuthLoginPage = () => {
    cy.url().should('contain', Cypress.config().authServerRoot + '/authorize')
  }

  context('Anonymous visitor', () => {
    it('redirects restricted pages to login', () => {
      [
        '/en/browse/pools',
      ].forEach(restrictedPath => {
        cy.visit(restrictedPath)
        onAuthLoginPage()
      })

    })
  })

  context('logged in but no applicant role', () => {
    beforeEach(() => cy.login('noroles'))

    it('displays not authorized', () => {
      [
        '/en/browse/pools',
      ].forEach(restrictedPath => {
        cy.visit(restrictedPath)
        cy.contains('not authorized');
      })

    })
  })

  context('logged in as applicant', () => {
    beforeEach(() => cy.login('applicant'))

    it("allows an applicant to apply to a pool", () => {
      cy.visit('/en/browse/pools')
      cy.contains("Browse Pools")

      cy.findByRole('link', {name: 'CMO Digital Careers'})
        .should('exist').and('be.visible')
        .click()

      cy.findByRole('link', {name: 'Apply'})
        .should('exist').and('be.visible')
        .click()

      // TODO: need to fill this out once it is possible to apply a pool in the app
    });
  })

  context('logged in with no email', () => {
    beforeEach(() => cy.login('noemail'));

    it("redirects to create account", () => {
      cy.visit('/en/browse/pools');

      cy.location('pathname').should('eq', '/en/talent/profile/create-account');
    });
  })

});
