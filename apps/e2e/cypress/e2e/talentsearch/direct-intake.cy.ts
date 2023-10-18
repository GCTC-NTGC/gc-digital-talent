import { aliasQuery } from "../../support/graphql-test-utils";

describe("Talentsearch Direct Intake Page", () => {
  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "browsePools");
    });
  });

  context("Anonymous visitor", () => {
    it("renders page", () => {
      ["/en/browse/pools"].forEach((restrictedPath) => {
        cy.visit(restrictedPath);
        cy.wait("@gqlbrowsePoolsQuery");
        cy.findByRole("heading", { name: /browse jobs/i })
          .should("exist")
          .and("be.visible");
      });
    });

    it("has no accessibility errors", () => {
      cy.visit("/en/browse/pools");
      cy.wait("@gqlbrowsePoolsQuery");
      cy.injectAxe();
      cy.findByRole("heading", { name: /browse jobs/i }).should("exist");
      cy.checkA11y();
    });
  });
});
