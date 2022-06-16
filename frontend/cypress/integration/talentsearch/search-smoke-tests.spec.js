import {
  aliasMutation,
  aliasQuery,
  setUpCommonGraphqlIntercepts,
} from "../../support/graphql-test-utils";
import { getInputByLabel } from "../../support/helpers";

describe("Talent Search Smoke Tests", () => {
  beforeEach(() => {
    // common requests
    setUpCommonGraphqlIntercepts();
    // page specific requests
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "countPoolCandidates");
      aliasQuery(req, "getPoolCandidateSearchRequestData");
      aliasMutation(req, "createPoolCandidateSearchRequest");
    });

    cy.visit("/en/talent/search");
  });

  it("searches for candidates and submits a request", () => {
    cy.get("form")
      .findByRole("radio", {
        name: /Required diploma from post-secondary institution/i,
      })
      .check();

    cy.wait("@gqlcountPoolCandidatesQuery");

    // integer greater than 0
    cy.contains(/Results: [1-9][0-9]* matching candidate/i);

    cy.findByRole("button", { name: /Request Candidates/i }).click();

    cy.wait("@gqlgetPoolCandidateSearchRequestDataQuery");

    getInputByLabel("Full Name").clear().type("Test Full Name");
    getInputByLabel("Government e-mail").clear().type("test@tbs-sct.gc.ca");
    getInputByLabel("What is the job title for this position?")
      .clear()
      .type("Test Job Title");
    getInputByLabel("Additional Comments").clear().type("Test Comments");
    getInputByLabel("Department / Hiring Organization").select(
      "Treasury Board Secretariat",
    );

    cy.contains("Required diploma from post-secondary institution");

    cy.findByRole("button", { name: /Submit Request/i }).click();

    cy.wait("@gqlcreatePoolCandidateSearchRequestMutation");

    cy.contains("Request created successfully");
  });
});
