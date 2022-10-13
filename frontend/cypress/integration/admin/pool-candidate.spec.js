import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";

describe("Pool Candidates", () => {
  const loginAndGoToPoolsPage = () => {
    cy.loginByRole("admin");
    cy.visit("/en/admin/pools");

    cy.findByRole("heading", { name: /pools/i })
      .should("exist")
      .and("be.visible");

    cy.url().should("contain", "/admin/pools");
  };

  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "GetPoolCandidateStatus");
      aliasQuery(req, "getPoolCandidateSnapshot");
      aliasQuery(req, "getPools");
      aliasQuery(req, "GetPoolCandidatesPaginated");

      aliasMutation(req, "UpdatePoolCandidateStatus");

      // Only used if FEATURE_APPLICANTSEARCH is false
      aliasQuery(req, "getUpdatePoolCandidateData");
      aliasMutation(req, "updatePoolCandidate");
      aliasMutation(req, "updatePoolCandidateAsAdmin");
    });

    loginAndGoToPoolsPage();
  });

  if (Cypress.env("FEATURE_APPLICANTSEARCH")) {
    it("should update pool candidate status (FEATURE_APPLICANTSEARCH:on)", () => {
      cy.wait("@gqlgetPoolsQuery");

      cy.findAllByRole("link", { name: /view candidates/i })
        .eq(0)
        .click();
      cy.wait("@gqlGetPoolCandidatesPaginatedQuery");

      cy.findAllByRole("button", { name: /availability/i })
        .eq(0)
        .click();
      cy.wait("@gqlGetPoolCandidatesPaginatedQuery");

      cy.findAllByRole("link", { name: /view application/i })
        .eq(0)
        .click();

      cy.wait("@gqlgetPoolCandidateSnapshotQuery");
      cy.wait("@gqlGetPoolCandidateStatusQuery");

      cy.findByRole("combobox", { name: /candidate pool status/i })
        .select("Screened In")
        .within(() => {
          cy.get("option:selected").should("have.text", "Screened In");
        });

      cy.findByLabelText(/Candidate expiry date/i).type("2023-12-01");

      cy.findByRole("textbox", { name: /notes/i }).clear().type("New Notes");

      cy.findByRole("button", { name: /save changes/i }).click();

      cy.wait("@gqlUpdatePoolCandidateStatusMutation");

      cy.expectToast(/pool candidate status updated successfully/i);
    });

    it("should update pool candidate status with optional fields", () => {
      cy.wait("@gqlgetPoolsQuery");

      cy.findAllByRole("link", { name: /view candidates/i })
        .eq(0)
        .click();
      cy.wait("@gqlGetPoolCandidatesPaginatedQuery");

      cy.findAllByRole("button", { name: /availability/i })
        .eq(0)
        .click();
      cy.wait("@gqlGetPoolCandidatesPaginatedQuery");

      cy.findAllByRole("link", { name: /view application/i })
        .eq(0)
        .click();

      cy.wait("@gqlgetPoolCandidateSnapshotQuery");
      cy.wait("@gqlGetPoolCandidateStatusQuery");

      cy.findByRole("combobox", { name: /candidate pool status/i })
        .select("Screened In")
        .within(() => {
          cy.get("option:selected").should("have.text", "Screened In");
        });

      cy.findByLabelText(/Candidate expiry date/i).clear();

      cy.findByRole("textbox", { name: /notes/i }).clear();

      cy.findByRole("button", { name: /save changes/i }).click();

      cy.wait("@gqlUpdatePoolCandidateStatusMutation");

      cy.expectToast(/pool candidate status updated successfully/i);
    });
  } else {
    it("should edit and update pool candidate (FEATURE_APPLICANTSEARCH:off)", () => {
      cy.wait("@gqlgetPoolsQuery");

      cy.findAllByRole("link", { name: /view candidates/i })
        .eq(0)
        .click();

      cy.wait("@gqlGetPoolCandidatesPaginatedQuery");

      cy.findAllByRole("link", { name: /view edit/i })
        .eq(0)
        .click();

      cy.wait("@gqlgetUpdatePoolCandidateDataQuery");

      cy.findByRole("heading", { name: /Update Pool Candidate/i })
        .should("exist")
        .and("be.visible");

      cy.findByLabelText(/expiry date/i).type("2023-12-01");

      cy.findByLabelText(/status/i).select("Placed Casual");

      cy.findByRole("button", { name: /submit/i }).click();

      cy.wait("@gqlupdatePoolCandidateAsAdminMutation");

      cy.expectToast(/pool candidate updated successfully/i);
    });
  }
});
