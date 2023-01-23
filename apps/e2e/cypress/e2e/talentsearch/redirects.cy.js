import { aliasQuery } from "../../support/graphql-test-utils";

const uuidRegEx = /[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/;

describe.only("Redirects", () => {
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

  it("redirects /en/talent/search", () => {
    cy.visit("/en/talent/search");
    cy.url().should("eq", "http://localhost:8000/en/search");
  });


  it(" 301 redirect", () => {
    cy.request({
      url: "/en/talent/search",
      followRedirect: false, // turn off following redirects
    }).then((resp) => {
      // redirect status code is 301
      expect(resp.status).to.eq(301);
      expect(resp.redirectedToUrl).to.eq("http://localhost:8000/en/search");
    });
  });
});
