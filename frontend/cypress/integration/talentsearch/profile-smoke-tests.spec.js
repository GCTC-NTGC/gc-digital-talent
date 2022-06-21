import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";
import { getInputByLabel } from "../../support/helpers";

describe("User Profile Smoke Tests", () => {
  const loginViaUI = (role) => {
    cy.fixture("users.json").then((users) => {
      const user = users[role];
      cy.get("input[name=username]").type(user.email);
    });
    cy.findByText("Sign-in").click();
  };

  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "getMe");
      aliasMutation(req, "UpdateUserAsUser");
      aliasMutation(req, "createWorkLocationPreference");
    });

    cy.visit("/en/talent/profile");
  });

  it("Reviews a user profile and makes some edits", () => {
    // hit the home page, login, hit the dashboard
    loginViaUI("applicant");
    cy.wait("@gqlgetMeQuery");
    cy.contains("span", "My Status");
    cy.url().should("contain", "/profile");

    // about me
    cy.contains("a", "Edit About Me").click();
    getInputByLabel("Current city").clear().type("Test City");
    cy.contains("Save and go back").click();
    cy.wait("@gqlUpdateUserAsUserMutation");
    cy.contains("User updated successfully");
    cy.url().should("contain", "/profile");

    // work location
    cy.contains("a", "Edit Work Location").click();
    getInputByLabel("Location exemptions").clear().type("Test Locations");
    cy.contains("Save and go back").click();
    cy.wait("@gqlcreateWorkLocationPreferenceMutation");
    cy.contains("User updated successfully");
    cy.url().should("contain", "/profile");
  });
});
