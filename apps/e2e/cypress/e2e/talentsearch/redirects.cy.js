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

describe("Verify search page redirect", () => {
const oldUrl = "/en/talent/search";
const newUrl = "http://localhost:8000/en/search";

it("redirects /en/talent/search", () => {
  cy.visit(oldUrl);
  cy.url().should("eq", newUrl);
});
it(" v301 redirect", () => {
  cy.request({
    url: oldUrl,
    followRedirect: false, // turn off following redirects
  }).then((resp) => {
    // redirect status code is 301
    expect(resp.status).to.eq(301);
    expect(resp.redirectedToUrl).to.eq(newUrl);
  });
});

});
