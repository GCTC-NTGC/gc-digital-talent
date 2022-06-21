describe("Talentsearch Search Page", () => {
  beforeEach(() => {
    cy.visit("/en/talent/search")
  });

  it("loads page successfully", () => {
    cy.findByRole("button", { name: /Request Candidates/i }).should("exist");
  });
});
