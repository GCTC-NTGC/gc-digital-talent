import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";

describe("User Profile Smoke Tests", () => {

  const loginAndGoToProfile = () => {
    cy.login("applicant");
    cy.visit("/en/talent/profile");

    // make sure we end up on the profile page
    cy.wait("@gqlgetMeQuery");
    cy.findByRole("heading", { name: /My Status/i })
      .should("exist")
      .and("be.visible");
    cy.url().should("contain", "/profile");
  };

  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "getMe");
      aliasMutation(req, "UpdateUserAsUser");
      aliasMutation(req, "createWorkLocationPreference");
    });

    loginAndGoToProfile();
  });

  it("Reviews a user profile and makes some edits", () => {
    // about me
    cy.findByRole("link", { name: /Edit About Me/i }).click();
    cy.findByRole("textbox", { name: /Current city/i })
      .clear()
      .type("Test City");
    cy.findByRole("button", { name: /Save and go back/i }).click();
    cy.wait("@gqlUpdateUserAsUserMutation");
    cy.findByRole("alert")
      .findByText(/User updated successfully/i)
      .should("exist")
      .and("be.visible");
    cy.url().should("contain", "/profile");

    // work location
    cy.findByRole("link", { name: /Edit Work Location/i }).click();
    cy.findByRole("textbox", { name: /Location exemptions/i })
      .clear()
      .type("Test Locations");
    cy.findByRole("button", { name: /Save and go back/i }).click();
    cy.wait("@gqlcreateWorkLocationPreferenceMutation");
    cy.findByRole("alert")
      .findByText(/User updated successfully/i)
      .should("exist")
      .and("be.visible");
    cy.url().should("contain", "/profile");
  });
});
