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

  const navigateToIAP = () => {
    cy.findByRole("link", { name: /edit indigenous apprenticeship program/i }).click();
    cy.wait("@gqlgetEditPoolDataQuery");
  }

  const navigateToCMO = () => {
    cy.findByRole("link", { name: /edit cmo digital careers/i }).click();
    cy.wait("@gqlgetEditPoolDataQuery");
  }

  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "getEditPoolData");
      aliasMutation(req, "updatePoolAdvertisement");
      aliasMutation(req, "publishPoolAdvertisement");
      aliasMutation(res, "closePoolAdvertisement");
    });

    loginAndGoToPoolsPage();
  });

  it("should update the pool", () => {
    navigateToIAP();

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

  // it("should publish the pool", () => {
  //    navigateToIAP();

  //   cy.findByRole("button", {name: /publish/i}).click();
  //   cy.wait("@gqlupdatePoolAdvertisementMutation");
  //   cy.expectToast(/pool updated successfully/i);
  // });

  it("should close and reopen the pool", () => {
    navigateToCMO();

    // Ensure we got to the correct page
    cy.findByRole("heading", { name: /edit pool advertisement/i })
      .should("exist")
      .and("be.visible");

    cy.findByRole("button", { name: /close/i });

    cy.findByRole("dialog", { name: /close manually/i })
      .should("exist")
      .and("be.visible")
      .within(() => {
        cy.findByRole("button", { name: /close pool now/i }).click();

        cy.wait("@gqlclosePoolAdvertisementMutation");
        cy.expectToast(/pool closed successfully/i);
      });
  });
});
