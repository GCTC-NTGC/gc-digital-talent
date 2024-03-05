import { aliasQuery } from "../../support/graphql-test-utils";

const uuidRegEx =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/;

describe("Redirects", () => {
  const expectToBeOnProfile = () => {
    cy.url().should(
      "match",
      new RegExp("users" + uuidRegEx + "personal-information", "gi"),
    );
  };

  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "ProfileUser");
    });
    cy.loginByRole("applicant");
  });

  it("redirects /talent/profile", () => {
    cy.visit("/en/talent/profile");
    cy.wait("@gqlProfileUserQuery");
    expectToBeOnProfile();
  });

  it("redirects /users/me", () => {
    cy.visit("/en/users/me");
    cy.wait("@gqlProfileUserQuery");
    expectToBeOnProfile();
  });
});

describe("Verify search page redirect", () => {
  const oldEnglishUrl = "/en/talent/search";
  const newEnglishUrl = "http://localhost:8000/en/search";

  const oldFrenchUrl = "/fr/talent/search";
  const newFrenchUrl = "http://localhost:8000/fr/search";

  it("redirects to proper url", () => {
    cy.visit(oldEnglishUrl);
    cy.url().should("eq", newEnglishUrl);
    cy.visit(oldFrenchUrl);
    cy.url().should("eq", newFrenchUrl);
  });

  it("gives 301 response code while redirect", () => {
    cy.request({
      url: oldEnglishUrl,
      followRedirect: false, // turn off following redirects
    }).then((resp) => {
      // redirect status code is 301
      expect(resp.status).to.eq(301);
      expect(resp.redirectedToUrl).to.eq(newEnglishUrl);
    });
    cy.request({
      url: oldFrenchUrl,
      followRedirect: false, // turn off following redirects
    }).then((resp) => {
      // redirect status code is 301
      expect(resp.status).to.eq(301);
      expect(resp.redirectedToUrl).to.eq(newFrenchUrl);
    });
  });
});
