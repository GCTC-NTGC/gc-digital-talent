import { setUpCommonGraphqlIntercepts, aliasQuery } from '../../support/graphql-test-utils'

describe("Talentsearch Search Page", () => {
  beforeEach(() => {
    // common requests
    setUpCommonGraphqlIntercepts()
    // page specific requests
    cy.intercept('POST', '/graphql', (req) => {
      aliasQuery(req, 'countPoolCandidates')
    })

    cy.visit("/en/talent/search")
  });

  it("loads page successfully", () => {
    cy.findByRole("button", { name: /Request Candidates/i }).should("exist");
  });

  it("checks, submits, and navigates to /request", () => {
    const doneLoading = () => {
      cy.wait('@gqlcountPoolCandidatesQuery')
    }

    cy.get("form")
      .findByRole("radio", {
        name: /Required diploma from post-secondary institution/i,
      })
      .check();
    doneLoading()
    cy.findByRole("button", { name: /Request Candidates/i }).click();
    cy.findByRole("button", { name: /Submit Request/i }).should("exist");
  });
});
