describe("Talentsearch Search Page", () => {
  beforeEach(() => cy.visit("/en/talent/search"));

  it("loads page successfully", () => {
    cy.wait(5000);
    cy.findByRole("button", { name: /Request Candidates/i }).should("exist");
  });

  it("checks, submits, and navigates to /request", () => {
    cy.wait(5000);
    cy.get("form")
      .findByRole("radio", {
        name: /Required diploma from post-secondary institution/i,
      })
      .check();
    cy.wait(2000);
    cy.findByRole("button", { name: /Request Candidates/i }).click();
    cy.wait(5000);
    cy.url().should("include", "/talent/request");
  });
});
