import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";

describe("Talent Search Workflow Tests", () => {
  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "countApplicants");
      aliasQuery(req, "getPoolCandidateSearchRequestData");
      aliasMutation(req, "createPoolCandidateSearchRequest");
    });

    cy.visit("/en/search");
  });

  const searchReturnsGreaterThanZeroApplicants = () => {
    cy.wait("@gqlcountApplicantsQuery");
    cy.findByRole("heading", {
      name: /Results: [1-9][0-9]* matching candidate/i,
    });
  };

  it("searches for candidates and submits a request", () => {
    // first request is without any filters
    cy.wait("@gqlcountApplicantsQuery");

    // second request is properly filtered
    searchReturnsGreaterThanZeroApplicants();

    cy.findByRole("radio", {
      name: /Required diploma from post-secondary institution/i,
    }).click();

    searchReturnsGreaterThanZeroApplicants();

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

    cy.expectToast(/Request created successfully/i);
  });
});
