import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";

describe("Admin Smoke Tests", () => {
  const loginAndGoToDashboard = () => {
    cy.login("admin");
    cy.visit("/en/admin");

    // make sure we end up on the dashboard
    cy.findByRole("heading", { name: /Welcome back/i })
      .should("exist")
      .and("be.visible");
    cy.url().should("contain", "/dashboard");
  };

  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "AllUsers");
      aliasQuery(req, "User");
      aliasMutation(req, "UpdateUserAsAdmin");
    });

    loginAndGoToDashboard();
  });

  it("Searches for a user and reviews the profile", () => {
    // find the applicant user to review
    cy.findByRole("link", { name: /Manage users/i }).click();
    cy.wait("@gqlAllUsersQuery");
    cy.findByRole("textbox", { name: /Search/i })
      .clear()
      .type("Applicant");

    // wait for table to rerender
    cy.findByText("applicant@test.com")
      .should("exist")
      .and("be.visible");

    cy.findByRole("table")
      .findByRole("row", { name: /applicant/i })
      .findByText("applicant@test.com") // findByRole link doesn't work here
      .click();

    // exercise profile page
    cy.findByRole("heading", { name: /Candidate Details/i })
      .should("exist")
      .and("be.visible");

    cy.findByRole("button", { name: /Print Profile/i })
      .should("exist")
      .and("be.visible")
      .and("be.enabled");

    cy.findByRole("tab", { name: /General Information/i }).click();

    cy.findByRole("heading", { name: /About/i })
      .should("exist")
      .and("be.visible");

    cy.findByRole("tab", { name: /Candidate Profile/i }).click();

    cy.findByRole("heading", { name: /About/i })
      .should("exist")
      .and("be.visible");
  });

  it("Searches for a user and edits the phone number", () => {
    // find the applicant user to edit
    cy.findByRole("link", { name: /Manage users/i }).click();
    cy.wait("@gqlAllUsersQuery");
    cy.findByRole("textbox", { name: /Search/i })
      .clear()
      .type("Applicant");

    // wait for table to rerender
    cy.findByText("applicant@test.com")
      .should("exist")
      .and("be.visible");

    cy.findByRole("table")
      .findByRole("row", { name: /applicant/i })
      .findByRole("link", { name: /Edit/i })
      .click();

    cy.wait("@gqlUserQuery");

    // edit the user in a small way
    cy.findByRole("textbox", { name: /Telephone/i })
      .clear()
      .type("+10123456789");
    cy.findByRole("button", { name: /Submit/i }).click();

    cy.wait("@gqlUpdateUserAsAdminMutation");

    cy.findByRole("alert")
      .findByText(/User updated successfully/i)
      .should("exist")
      .and("be.visible");
  });
});
