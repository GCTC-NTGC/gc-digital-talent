import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";

describe("Talent Search Smoke Tests", () => {
  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "countPoolCandidates");
      aliasQuery(req, "getPoolCandidateSearchRequestData");
      aliasMutation(req, "createPoolCandidateSearchRequest");
    });

    cy.visit("/en/talent/search");
  });

  const searchReturnsGreaterThanZeroCandidates = () => {
    cy.wait("@gqlcountPoolCandidatesQuery");
    cy.findByRole("heading", {
      name: /Results: [1-9][0-9]* matching candidate/i,
    });
  };

  it("searches for candidates and submits a request", () => {
    searchReturnsGreaterThanZeroCandidates();

    cy.findByRole("radio", {
      name: /Required diploma from post-secondary institution/i,
    }).check();

    searchReturnsGreaterThanZeroCandidates();

    cy.findByRole("button", { name: /Request Candidates/i }).click();

    cy.wait("@gqlgetPoolCandidateSearchRequestDataQuery");

    cy.findByRole("textbox", { name: /Full Name/i })
      .clear()
      .type("Test Full Name");

    cy.findByRole("textbox", { name: /Government e-mail/i })
      .clear()
      .type("test@tbs-sct.gc.ca");

    cy.findByRole("textbox", {
      name: /What is the job title for this position\?/i,
    })
      .clear()
      .type("Test Job Title");

    cy.findByRole("textbox", { name: /Additional Comments/i })
      .clear()
      .type("Test Comments");

    cy.findByRole("combobox", { name: /Department/i }).select(
      "Treasury Board Secretariat",
    );

    // will actually exist twice in the DOM
    cy.findAllByText("Required diploma from post-secondary institution").should(
      "exist",
    );

    cy.findByRole("button", { name: /Submit Request/i }).click();

    cy.wait("@gqlcreatePoolCandidateSearchRequestMutation");

    cy.findByRole("alert")
      .findByText(/Request created successfully/i)
      .should("exist")
      .and("be.visible");
  });
});
