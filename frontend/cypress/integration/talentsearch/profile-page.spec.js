describe("Talentsearch Profile Page", () => {
  // Helpers
  const onAuthLoginPage = () => {
    cy.url().should('contain', Cypress.config().authServerRoot + '/authorize')
  }

  context('Anonymous visitor', () => {
    it('redirects restricted pages to login', () => {
      [
        '/en/talent/profile/',
        '/en/talent/profile/about-me',
        '/en/talent/profile/language-information',
        '/en/talent/profile/government-information',
        '/en/talent/profile/work-location',
        '/en/talent/profile/work-preferences',
        '/en/talent/profile/diversity-and-inclusion',
        '/en/talent/profile/skills-and-experiences',
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
        '/en/talent/profile/',
        '/en/talent/profile/about-me',
        '/en/talent/profile/language-information',
        '/en/talent/profile/government-information',
        '/en/talent/profile/work-location',
        '/en/talent/profile/work-preferences',
        '/en/talent/profile/diversity-and-inclusion',
        '/en/talent/profile/skills-and-experiences',
      ].forEach(restrictedPath => {
        cy.visit(restrictedPath)
        cy.contains('not authorized');
      })

    })
  })

  context('logged in as applicant', () => {
    beforeEach(() => cy.login('applicant'))

    it("loads page successfully", () => {
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
