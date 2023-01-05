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
    });

    loginAndGoToPoolsPage();
  });

  it("should update pool candidate status", () => {
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

});
