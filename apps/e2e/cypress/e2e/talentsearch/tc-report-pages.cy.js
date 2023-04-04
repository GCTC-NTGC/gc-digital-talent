describe("TC Report Pages", () => {
  context("Talent Cloud project page", () => {
    it("should exist", () => {
      cy.visit("/en/talent-cloud");
      cy.findByRole("heading", { name: "Talent Cloud", level: 1 }).should(
        "exist",
      );
    });
  });

  context("Talent Cloud Report page", () => {
    it("should exist", () => {
      cy.visit("/en/talent-cloud/report");
      // Note: A <br> between "Talent Cloud" and "Results Report" is ignored by the findByRole name option.
      cy.findByRole("heading", {
        name: "The Talent CloudResults Report",
        level: 1,
      }).should("exist");
    });
  });
});
