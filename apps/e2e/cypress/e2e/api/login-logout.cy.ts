import { aliasQuery } from "cypress/support/graphql-test-utils";

describe("Login and logout", () => {
  // Prepare to intercept/detect relevant GraphQL requests.
  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "authorizationQuery");
    });
  });

  context("log in", () => {
    it("can log in", () => {
      cy.intercept({ pathname: "/auth-callback" }).as("authCallback");

      // start the login process
      cy.visit("/login?from=/en/applicant/profile-and-applications&locale=en");
      cy.fixture("users.json").then((users) => {
        const applicantUser = users.applicant;
        cy.get("input[name=username]").type(applicantUser.subject);
      });
      cy.findByRole("button", { name: "Sign-in" }).click();

      // complete login process
      cy.wait("@authCallback").then((interception) => {
        const location = Array.isArray(interception.response.headers.location)
          ? interception.response.headers.location[0]
          : interception.response.headers.location;
        const url = new URL(location);
        cy.wrap(url.searchParams.get("access_token")).as("accessToken");
      });

      // auth context provider will update itself - make sure it uses the new access token
      cy.wait("@gqlauthorizationQueryQuery").then((interception) => {
        cy.get("@accessToken").then((accessToken) => {
          expect(interception.request.headers["authorization"]).to.eq(
            `Bearer ${accessToken}`,
          );
        });
      });
    });
    // it("will show a message when logged in as a deleted user", () => {
    //   // If you log in as a deleted user you end up on the "user deleted" page.
    // });
  });

  // context("refresh", () => {
  //   it("can refresh the token", () => {
  //     // Can wait five minutes and then the token is refreshed on the next API call.
  //   });
  //   it("can share the refresh", () => {
  //     // When you have two tabs open, a refresh in one will allow the second tab to make an API call with the new tokens and no refresh.
  //   });
  //   it("can chain two refreshes", () => {
  //     // can chain two refreshes
  //   });
  // });

  // context("log out", () => {
  //   it("can log out", () => {
  //     // Can log out (with SiC endsession).
  //   });
  //   it("will log out when introspection fails", () => {
  //     // If introspection fails the user is immediately logged out.
  //   });
  //   it("will log out when refresh fails", () => {
  //     // Breaking refresh by restarting the auth container -> leads to logged out page
  //   });
  //   it("will affect all tabs when logged out", () => {
  //     // Logout appears to affect all logged in tabs
  //   });
  // });
});
