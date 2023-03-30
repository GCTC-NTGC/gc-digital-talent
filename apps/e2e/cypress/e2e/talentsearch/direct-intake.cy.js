import { aliasQuery } from "../../support/graphql-test-utils";

describe("Talentsearch Direct Intake Page", () => {
  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "browsePoolAdvertisements");
    });
  });

  context("Anonymous visitor", () => {
    it("renders page", () => {
      ["/en/browse/pools"].forEach((restrictedPath) => {
        cy.visit(restrictedPath);
        cy.wait("@gqlbrowsePoolAdvertisementsQuery");
        cy.findByRole("heading", { name: /browse i t jobs/i })
          .should("exist")
          .and("be.visible");
      });
    });
  });
});
