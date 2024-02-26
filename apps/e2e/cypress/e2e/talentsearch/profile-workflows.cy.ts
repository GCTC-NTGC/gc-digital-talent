import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";

describe("User Profile Workflow Tests", () => {
  const loginAndGoToProfile = () => {
    cy.loginByRole("applicant");
    cy.visit("/en/users/test-applicant/personal-information");

    // make sure we end up on the personal information page
    cy.wait("@gqlgetMeQuery");
    cy.findByRole("heading", { name: /Personal and contact information/i })
      .should("exist")
      .and("be.visible");
    cy.url().should("contain", "/personal-information");
  };

  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "getMe");
      aliasMutation(req, "UpdateUserAsUser");
    });

    loginAndGoToProfile();
  });

  it("Reviews a user profile and makes some edits", () => {
    // personal and contact information
    cy.findByRole("button", { name: /Edit personal/i }).click();
    cy.findByRole("textbox", { name: /Current city/i }).clear();
    cy.findByRole("textbox", { name: /Current city/i }).type("Test City");
    cy.findByRole("button", { name: /Save changes/i }).click();
    cy.wait("@gqlUpdateUserAsUserMutation");
    cy.expectToast(/information updated successfully/i);
    cy.url().should("contain", "/personal-information");

    // work preferences
    cy.findByRole("button", { name: /Edit Work preferences/i }).click();
    cy.findByRole("textbox", {
      name: /please indicate if there is a city/i,
    }).clear();
    cy.findByRole("textbox", {
      name: /please indicate if there is a city/i,
    }).type("Test Locations");
    cy.findByRole("button", { name: /Save changes/i }).click();
    cy.wait("@gqlUpdateUserAsUserMutation");
    cy.expectToast(/work preferences updated successfully/i);
    cy.url().should("contain", "/personal-information");
  });
});
