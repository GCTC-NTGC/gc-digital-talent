import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";

describe("User Profile Workflow Tests", () => {
  const loginAndGoToProfile = () => {
    cy.loginByRole("applicant");
    cy.visit("/en/users/test-applicant/profile");

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
      aliasMutation(req, "UpdateUserAboutMe");
      aliasMutation(req, "createWorkLocation");
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
    cy.wait("@gqlUpdateUserAboutMeMutation");
    cy.expectToast(/User updated successfully/i);
    cy.url().should("contain", "/profile");

    // work location
    cy.findByRole("link", { name: /Edit Work Location/i }).click();
    cy.findByRole("textbox", { name: /Location exemptions/i })
      .clear()
      .type("Test Locations");
    cy.findByRole("button", { name: /Save and go back/i }).click();
    cy.wait("@gqlcreateWorkLocationMutation");
    cy.expectToast(/User updated successfully/i);
    cy.url().should("contain", "/profile");
  });
});
