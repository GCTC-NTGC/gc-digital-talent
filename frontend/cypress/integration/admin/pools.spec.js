import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";

describe("Pools", () => {
  const loginAndGoToPoolsPage = () => {
    cy.login("admin");
    cy.visit("/en/admin/pools");

    cy.findByRole("heading", { name: /pools/i })
      .should("exist")
      .and("be.visible");

    cy.url().should("contain", "/admin/pools");
  }

  /**
   * Wait for update mutation
   * Check for success toast
   */
  const expectUpdate = () => {
    cy.wait("@gqlupdatePoolAdvertisementMutation");
    cy.expectToast(/pool updated successfully/i);
  }

  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "getEditPoolData");
      aliasMutation(req, "updatePoolAdvertisement");
      aliasMutation(req, "PublishPool");
    });

    loginAndGoToPoolsPage();
  });

  it("should update the pool", () => {
    // Navigate to edit page of draft
    cy.findByRole("link", { name: /edit indigenous apprenticeship program/i }).click();
    cy.wait("@gqlgetEditPoolDataQuery");

    // Ensure we got to the correct page
    cy.findByRole("heading", { name: /edit pool advertisement/i })
      .should("exist")
      .and("be.visible");

    // Update the classification field
    cy.findByRole("combobox", { name: /classification/i })
      .select("IT-04 (Information Technology)")
      .within(() => {
        cy.get("option:selected")
          .should('have.text', "IT-04 (Information Technology)");
      });

    // Submit the form
    cy.findByRole("button", { name: /save pool name/i }).click();
    expectUpdate();

    // Update expiry date to some arbitrary date in the future
    cy.findByLabelText(/end date/i)
      .clear()
      .type("2030-01-01")

    cy.findByRole("button", { name: /save closing date/i }).click();
    expectUpdate();

  });
});
