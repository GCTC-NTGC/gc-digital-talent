describe("Talentsearch Search Page", () => {
  beforeEach(() => {
    cy.visit("/en/search")
  });

  it("loads page successfully", () => {
    cy.findByRole("button", { name: /Request Candidates/i }).should("exist");
  });
});
