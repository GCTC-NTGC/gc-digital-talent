import { aliasQuery } from "../../support/graphql-test-utils";

describe("Talentsearch Direct Intake Page", () => {
  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "getPoolAdvertisement");
    });
  });

  context('Anonymous visitor', () => {
    it('renders page', () => {
      [
        '/en/browse/pools',
      ].forEach(restrictedPath => {
        cy.visit(restrictedPath)
        cy.findByRole("heading", { name: /browse it jobs/i })
          .should("exist")
          .and("be.visible");
      })

    })
  });
});
