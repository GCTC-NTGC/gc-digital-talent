import {
  aliasMutation,
  aliasQuery,
  setUpCommonGraphqlIntercepts,
} from "../../support/graphql-test-utils";
import { getInputByLabel } from "../../support/helpers";

describe("Admin Smoke Tests", () => {
  const loginViaUI = (role) => {
    cy.fixture("users.json").then((users) => {
      const user = users[role];
      cy.get("input[name=username]").type(user.email);
    });
    cy.findByText("Sign-in").click();
  };

  beforeEach(() => {
    // common requests
    setUpCommonGraphqlIntercepts();
    // page specific requests
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "AllUsers");
      aliasQuery(req, "User");
      aliasMutation(req, "UpdateUserAsAdmin");
    });

    cy.visit("/en/admin");
  });

  it("Searches for a user, reviews the profile, and edits the phone number", () => {
    // hit the home page, login, hit the dashboard
    cy.contains("h1", "Home");
    cy.contains("a", "Login").click();
    loginViaUI("admin");
    cy.contains("h1", "Welcome back");
    cy.url().should("contain", "/dashboard");

    // find the applicant user to play with
    cy.contains("a", "Manage users").click();
    cy.wait("@gqlAllUsersQuery");
    getInputByLabel("Search").clear().type("Applicant");
    cy.contains("a", "applicant@test.com").click();

    // exercise profile page
    cy.contains("h1", "Candidate Details");
    cy.contains("button", "Print Profile");
    cy.contains("General Information").click();
    cy.contains("span", "About");
    cy.contains("Candidate Profile").click();
    cy.contains("span", "About");

    // find the applicant user to play with
    cy.contains("a", "Users").click();
    //cy.wait("@gqlAllUsersQuery");  // will be cached and not fired a second time
    getInputByLabel("Search").clear().type("Applicant");
    cy.contains("td", "applicant@test.com")
      .siblings()
      .contains("a", "Edit")
      .click();
    cy.wait("@gqlUserQuery");

    // edit the user in a small way
    getInputByLabel("Telephone").clear().type("+10123456789");
    cy.contains("button", "Submit").click();
    cy.wait("@gqlUpdateUserAsAdminMutation");
    cy.contains("User updated successfully");
  });
});
