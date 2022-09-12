describe("Talentsearch Profile Page", () => {
  // Helpers
  const onAuthLoginPage = () => {
    cy.url().should('contain', Cypress.config().authServerRoot + '/authorize')
  }

  context('Anonymous visitor', () => {
    it('redirects restricted pages to login', () => {
      [
        '/en/talent/profile',
        '/en/users/test-applicant/profile',
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
        '/en/talent/profile',
        '/en/users/test-no-role/profile',
        '/en/users/test-no-role/profile/about-me/edit',
        '/en/users/test-no-role/profile/language-info/edit',
        '/en/users/test-no-role/profile/government-info/edit',
        '/en/users/test-no-role/profile/role-salary-expectations/edit',
        '/en/users/test-no-role/profile/work-location/edit',
        '/en/users/test-no-role/profile/work-preferences/edit',
        '/en/users/test-no-role/profile/employment-equity/edit',
        '/en/users/test-no-role/profile/experiences',
      ].forEach(restrictedPath => {
        cy.visit(restrictedPath)
        cy.contains('not authorized');
      })

    })
  })

  context('logged in as applicant', () => {
    beforeEach(() => cy.login('applicant'))

    it("loads page successfully", () => {
      cy.visit('/en/users/test-applicant/profile')
      cy.contains("My Status");
      cy.contains("My hiring pools");
      cy.contains("About Me");
      cy.contains("Language Information");
      cy.contains("Government Information");
      cy.contains("Work Location");
      cy.contains("Work Preferences");
      cy.contains("Diversity, equity and inclusion");
      cy.contains("My skills and experience");

      cy.visit('/en/talent/profile')
      cy.contains("My Status");
      cy.contains("My hiring pools");
      cy.contains("About Me");
      cy.contains("Language Information");
      cy.contains("Government Information");
      cy.contains("Work Location");
      cy.contains("Work Preferences");
      cy.contains("Diversity, equity and inclusion");
      cy.contains("My skills and experience");
    });
  })

});
