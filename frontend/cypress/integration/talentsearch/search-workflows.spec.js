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
    cy.findByRole("heading", {
      name: /Results: [1-9][0-9]* matching candidate/i,
    });
  };

  it("searches for candidates and submits a request", () => {
    // first request is without any filters
    cy.wait("@gqlcountApplicantsQuery");

    // second request is properly filtered
    searchReturnsGreaterThanZeroApplicants();

    cy.findByRole("combobox", { name: /Classification/i }).select(1);
    cy.wait("@gqlcountApplicantsQuery");

    cy.findByRole("radio", {
      name: /Required diploma from post-secondary institution/i,
    }).click();
    cy.wait("@gqlcountApplicantsQuery");

    // Wait for each request to finish, to minimize inconsistent state.
    cy.findByRole("combobox", { name: /Region/i }).then($input => {
      cy.wrap($input).type("Telework{enter}{enter}")
      cy.wait("@gqlcountApplicantsQuery");

      cy.wrap($input).type("Ontario{enter}{enter}")
      cy.wait("@gqlcountApplicantsQuery");

      cy.wrap($input).type("National Capital{enter}{enter}")
      cy.wait("@gqlcountApplicantsQuery");

      cy.wrap($input).type("Atlantic{enter}{enter}");
      cy.wait("@gqlcountApplicantsQuery");
    })

    searchReturnsGreaterThanZeroApplicants();

    cy.findByRole("button", { name: /Request Candidates/i }).then($button => {
      cy.wrap($button)
        .should("exist")
        .and("be.visible")
        .and("not.be.disabled");
      // Force click to mitigate async re-render of button that detaches its DOM element.
      // See: https://github.com/GCTC-NTGC/gc-digital-talent/pull/4119#issuecomment-1271642887
      cy.wrap($button).click({ force: true });
    });

    cy.wait("@gqlgetPoolCandidateSearchRequestDataQuery");

    cy.findByRole("textbox", { name: /Full Name/i })
      .type("Test Full Name");

    cy.findByRole("textbox", { name: /Government e-mail/i })
      .type("test@tbs-sct.gc.ca");

    cy.findByRole("textbox", {
      name: /What is the job title for this position\?/i,
    })
      .type("Test Job Title");

    cy.findByRole("textbox", { name: /Additional Comments/i })
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
