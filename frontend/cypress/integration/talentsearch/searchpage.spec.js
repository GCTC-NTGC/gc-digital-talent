describe("Talentsearch Search Page", () => {
  beforeEach(() => cy.visit("/en/talent/search"));

  it("loads page successfully", () => {
    cy.findByRole("button", { name: /Request Candidates/i }).should("exist");
  });

  it("checks, submits, and navigates to /request", () => {
    cy.get("form")
      .findByRole("radio", {
        name: /Required diploma from post-secondary institution/i,
      })
      .check();
    cy.findByRole("button", { name: /Request Candidates/i }).click();
    cy.findByRole("button", { name: /Submit Request/i }).should("exist");
  });
});
