describe("Talentsearch Profile Page", () => {
  // Helpers
  const onLoginInfoPage = () => {
    cy.url().should("contain", "/en/login-info");
  };

  context("Anonymous visitor", () => {
    it("redirects restricted pages to login", () => {
      [
        "/en/talent/profile",
        "/en/users/test-applicant/personal-information",
      ].forEach((restrictedPath) => {
        cy.visit(restrictedPath);
        onLoginInfoPage();
      });
    });
  });

  context("logged in but no applicant role", () => {
    beforeEach(() => cy.loginByRole("noroles"));

    it("displays not authorized", () => {
      /**
       * React error boundaries are bubbling exceptions
       * up, so we need to tell cypress to ignore them
       *
       * REF: https://github.com/cypress-io/cypress/issues/7196#issuecomment-971592350
       */
      cy.on("uncaught:exception", () => false);

      [
        "/en/talent/profile",
        "/en/users/test-no-role/personal-information",
        "/en/users/test-no-role/personal-information/career-timeline",
      ].forEach((restrictedPath) => {
        cy.visit(restrictedPath);
        cy.contains("not authorized");
      });
    });
  });

  context("logged in as applicant", () => {
    beforeEach(() => cy.loginByRole("applicant"));

    it("loads page successfully", () => {
      cy.visit("/en/users/test-applicant/personal-information");
      cy.contains("Personal and contact information");
      cy.contains("Work preferences");
      cy.contains("Diversity, equity, and inclusion");
      cy.contains("Government employee information");
      cy.contains("Language profile");

      cy.visit("/en/talent/profile");
      cy.contains("Personal and contact information");
      cy.contains("Work preferences");
      cy.contains("Diversity, equity, and inclusion");
      cy.contains("Government employee information");
      cy.contains("Language profile");
    });
  });
});
