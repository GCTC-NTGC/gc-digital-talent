import { aliasMutation } from "../../support/graphql-test-utils";

describe("Create account tests", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/graphql", (req) => {
      aliasMutation(req, "CreateAccount_Mutation");
    });
  });

  it("Logging in as a new user goes to create-account and then to profile", () => {
    const uniqueTestId = (
      Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1
    ).toString();

    cy.loginBySubject(uniqueTestId);
    cy.visit("/en/applicant");

    // should go to the create-account page
    cy.findByRole("heading", {
      name: "Welcome to GC Digital Talent",
      level: 1,
    }).should("exist");

    cy.findByRole("textbox", { name: /First Name/i }).then((textbox) => {
      cy.wrap(textbox).type("Cypress");
    });
    cy.findByRole("textbox", { name: /Last Name/i }).then((textbox) => {
      cy.wrap(textbox).type(uniqueTestId);
    });
    cy.findByRole("textbox", {
      name: /Which email do you like to be contacted at/i,
    }).then((textbox) => {
      cy.wrap(textbox).type(`cypress-${uniqueTestId}@example.org`);
    });
    cy.findByRole("group", {
      name: /What is your preferred contact language/i,
    }).within(() => {
      cy.findByRole("radio", {
        name: /English/i,
      }).click();
    });
    cy.findByRole("group", {
      name: /Do you currently work for the government of Canada/i,
    }).within(() => {
      cy.findByRole("radio", {
        name: /No/i,
      }).click();
    });
    cy.findByRole("group", {
      name: /Priority Entitlement/i,
    }).within(() => {
      cy.findByRole("radio", {
        name: /I do not have a priority entitlement/i,
      }).click();
    });
    cy.findByRole("button", { name: "Save and go to my profile" }).click();

    cy.wait("@gqlCreateAccount_MutationMutation");
    // should go to the personal information page
    cy.findByRole("heading", {
      name: /Welcome back/i,
      level: 1,
    }).should("exist");
  });
});
