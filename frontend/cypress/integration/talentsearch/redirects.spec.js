import { aliasQuery } from "../../support/graphql-test-utils";

const uuidRegEx = /[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/;

describe("Redirects", () => {
  const expectToBeOnProfile = () => {
    cy.wait("@gqlgetMeQuery");
    cy.url()
    .should('match', new RegExp("users" + uuidRegEx + "profile", "gi"));
  }

  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "getMe");
    });
    cy.loginByRole('applicant')
  });

  it("redirects /talent/profile", () => {
    cy.visit("/en/talent/profile");
    cy.wait("@gqlgetMeQuery");
    expectToBeOnProfile();
  });

  it("redirects /users/me", () => {
    cy.visit("/en/users/me");
    cy.wait("@gqlgetMeQuery");
    expectToBeOnProfile();
  });
});
