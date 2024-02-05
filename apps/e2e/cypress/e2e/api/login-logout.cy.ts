import {
  aliasQuery,
  hasOperationName,
} from "cypress/support/graphql-test-utils";

// https://stackoverflow.com/a/67096081
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const testUserSubject = "applicant@test.com";

describe("Login and logout", () => {
  // Prepare to intercept/detect relevant GraphQL requests.
  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "authorizationQuery");
    });
  });

  context("log in", () => {
    // will log in successfully
    it("can log in", () => {
      cy.intercept({ pathname: "/auth-callback" }).as("authCallback");

      // start the login process
      cy.visit("/login");
      cy.get("input[name=username]").type(testUserSubject);
      cy.findByRole("button", { name: "Sign-in" }).click();

      // complete login process
      cy.wait("@authCallback").then((interception) => {
        const location = Array.isArray(interception.response.headers.location)
          ? interception.response.headers.location[0]
          : interception.response.headers.location;
        const url = new URL(location);
        cy.wrap(url.searchParams.get("access_token")).as("accessToken");
      });

      // auth context provider will update itself
      cy.wait("@gqlauthorizationQueryQuery").then((interception) => {
        // make sure we get a user ID back
        expect(interception.response.body)
          .nested.property("data.myAuth.id")
          .matches(uuidRegex);

        cy.get("@accessToken").then((accessToken) => {
          // make sure it uses the access token
          expect(interception.request.headers["authorization"]).to.eq(
            `Bearer ${accessToken}`,
          );
        });
      });
    });

    // If you log in as a deleted user you end up on the "user deleted" page.
    it("will show a message when logged in as a deleted user", () => {
      // stub the "user deleted" API response
      cy.intercept("POST", "/graphql", (req) => {
        if (hasOperationName(req, "authorizationQuery")) {
          // Declare the alias from the initial intercept in the beforeEach
          req.alias = "gqlauthorizationQueryQuery";
          // Set req.reply to modify the response
          req.reply({
            data: { myAuth: null },
            errors: [
              {
                message: `Login as deleted user: ${testUserSubject}`,
                extensions: {
                  reason: "user_deleted",
                },
              },
            ],
          });
        }
      });

      // start the login process
      cy.visit("/login");
      cy.get("input[name=username]").type(testUserSubject);
      cy.findByRole("button", { name: "Sign-in" }).click();

      // the auth response will indicate the user was deleted

      // eventually, we should get to the "user deleted page"
      cy.findByRole("heading", {
        name: "Account deleted",
        level: 1,
      }).should("exist");
    });
  });

  context("refresh", () => {
    // will log in and refresh the token successfully
    it("can refresh the token", () => {
      cy.intercept({ pathname: "/refresh*" }).as("refresh");
      cy.getTokensFromDebugger({
        issuerId: "fast-expire",
        userSubject: testUserSubject,
      }).as("firstTokenSet");

      // Return to the app with the debugger token response
      cy.get("@firstTokenSet").then((firstTokenSet) => {
        const appUrl = new URL("http://localhost:8000/en"); // navigate to /en to avoid the extra redirect
        Object.keys(firstTokenSet).forEach((key) =>
          appUrl.searchParams.set(key, firstTokenSet[key]),
        );
        cy.visit(appUrl.toString());
      });

      // expect an immediate refresh
      cy.wait("@refresh").then((interception) => {
        cy.get("@firstTokenSet").then((firstTokenSet) => {
          // make sure it uses the refresh token
          expect(interception.request.query["refresh_token"]).to.eq(
            firstTokenSet["refresh_token"],
          );

          const secondTokenSet = JSON.parse(interception.response.body); //  #9148
          cy.wrap(secondTokenSet).as("secondTokenSet");
        });
      });

      // auth context provider will update itself -
      cy.wait("@gqlauthorizationQueryQuery").then((interception) => {
        // make sure we get a user ID back
        expect(interception.response.body)
          .nested.property("data.myAuth.id")
          .matches(uuidRegex);

        cy.get("@secondTokenSet").then((secondTokenSet) => {
          // make sure it uses the new access token
          expect(interception.request.headers["authorization"]).to.eq(
            `Bearer ${secondTokenSet["access_token"]}`,
          );
        });
      });
    });

    // When you have two tabs open, a refresh in one will allow the second tab to make an API call with the new tokens and no refresh.
    it("can share the refresh", () => {
      cy.getTokensFromDebugger({
        issuerId: "fast-expire",
        userSubject: testUserSubject,
      }).then((firstTokenSet) => {
        // Return to the app with the debugger token response
        const appUrl = new URL(
          "http://localhost:8000/en/applicant/profile-and-applications",
        ); // navigate to /en to avoid the extra redirect
        Object.keys(firstTokenSet).forEach((key) =>
          appUrl.searchParams.set(key, firstTokenSet[key]),
        );
        cy.visit(appUrl.toString());
      });

      // confirm login
      cy.findByRole("heading", {
        name: "Welcome back, Applicant",
        level: 1,
      });

      // simulate a refresh in a second tab by logging in with a different set of tokens
      cy.loginBySubject(testUserSubject);
      cy.window().then((browserWindow) => {
        const newAccessToken =
          browserWindow.localStorage.getItem("access_token");
        console.debug("access token after injection", newAccessToken);
        cy.wrap(newAccessToken).as("secondTabAccessToken");
      });

      cy.intercept({ method: "POST  ", pathname: "/graphql" }).as("anyGraphql");

      // not important, just need an API request to occur
      cy.findByRole("navigation", { name: "Personal information" }).within(
        () => {
          cy.findByRole("link", { name: "Personal information" }).click();
        },
      );

      // the second access token is used
      cy.wait("@anyGraphql").then((interception) => {
        // make sure it uses the second access token
        cy.get("@secondTabAccessToken").then((secondTabAccessToken) => {
          expect(interception.request.headers["authorization"]).to.eq(
            `Bearer ${secondTabAccessToken}`,
          );
        });
      });
    });

    // will log in, do a token refresh, and do a second token refresh from that
    it("can chain two refreshes", () => {
      cy.intercept({ pathname: "/refresh*" }).as("refresh");
      cy.intercept({ method: "POST  ", pathname: "/graphql" }).as("anyGraphql");
      cy.getTokensFromDebugger({
        issuerId: "fast-expire",
        userSubject: testUserSubject,
      }).then((firstTokenSet) => {
        // Return to the app with the debugger token response
        const appUrl = new URL("http://localhost:8000/en"); // navigate to /en to avoid the extra redirect
        Object.keys(firstTokenSet).forEach((key) =>
          appUrl.searchParams.set(key, firstTokenSet[key]),
        );
        cy.visit(appUrl.toString());
      });

      // expect a first refresh to get second tokens
      cy.wait("@refresh").then((interception) => {
        const secondTokenSet = JSON.parse(interception.response.body); //  #9148
        cy.wrap(secondTokenSet).as("secondTokenSet");
      });

      // the second access token is used
      cy.wait("@anyGraphql").then((interception) => {
        cy.get("@secondTokenSet").then((secondTokenSet) => {
          // make sure it uses the second access token
          expect(interception.request.headers["authorization"]).to.eq(
            `Bearer ${secondTokenSet["access_token"]}`,
          );
        });
      });

      // not important, just need an API request to occur
      cy.findByRole("navigation", { name: "Main menu" }).within(() => {
        cy.findByRole("link", { name: "Find talent" }).click();
      });

      // expect a second refresh to get third tokens
      cy.wait("@refresh").then((interception) => {
        cy.get("@secondTokenSet").then((secondTokenSet) => {
          // make sure it uses the second refresh token
          expect(interception.request.query["refresh_token"]).to.eq(
            secondTokenSet["refresh_token"],
          );
          const thirdTokenSet = JSON.parse(interception.response.body); //  #9148
          cy.wrap(thirdTokenSet).as("thirdTokenSet");
        });
      });

      // the third access token is used
      cy.wait("@anyGraphql").then((interception) => {
        cy.get("@thirdTokenSet").then((thirdTokenSet) => {
          // make sure it uses the third access token
          expect(interception.request.headers["authorization"]).to.eq(
            `Bearer ${thirdTokenSet["access_token"]}`,
          );
        });
      });
    });
  });

  context("log out", () => {
    // properly logs out, including ending the session with the auth provider
    it("can log out", () => {
      cy.intercept({ pathname: "/oxauth/endsession" }).as("endsession");

      cy.loginBySubject(testUserSubject).then(() => {
        cy.wrap(localStorage.getItem("id_token")).as("idToken");
      });

      cy.visit("/en/logged-out");
      cy.findByRole("button", { name: "Sign out" }).click();

      cy.wait("@endsession").then((interception) => {
        expect(interception.request.query["post_logout_redirect_uri"]).to.exist;
        cy.get("@idToken").then((idToken) => {
          expect(interception.request.query["id_token_hint"]).to.eq(idToken);
        });
      });

      cy.findByRole("heading", {
        name: "See you next time!",
        level: 1,
      }).should("exist");
    });

    // If token validation fails the user is immediately logged out.
    it("will log out when token validation fails", () => {
      cy.intercept({ pathname: "/oxauth/endsession" }).as("endsession");

      cy.loginBySubject(testUserSubject);

      // simulate the API indicating the token is inactive
      cy.intercept(
        { method: "POST", pathname: "/graphql" },
        {
          errors: [
            {
              message: "Mock token validation message",
              extensions: {
                reason: "token_validation",
              },
            },
          ],
        },
      );

      // try to visit a page
      cy.visit("/en");

      // expect a session end and logout
      cy.wait("@endsession");
      cy.findByRole("heading", {
        name: "See you next time!",
        level: 1,
      }).should("exist");
    });

    // Logout appears to affect all logged in tabs
    // Bug in app prevents this test from completing: #9188
    it.skip("will affect all tabs when logged out", () => {
      cy.loginBySubject(testUserSubject);
      cy.visit("/en/applicant/profile-and-applications");

      // confirm login
      cy.findByRole("heading", {
        name: "Welcome back, Applicant",
        level: 1,
      }).should("exist");

      // simulate logged out in a different tab
      cy.clearLocalStorage("access_token");
      cy.clearLocalStorage("refresh_token");

      // not important, just need an API request to occur
      cy.findByRole("navigation", { name: "Personal information" }).within(
        () => {
          cy.findByRole("link", { name: "Personal information" }).click();
        },
      );

      // forcibly logged out
      cy.findByRole("heading", {
        name: "See you next time!",
        level: 1,
      }).should("exist");
    });
  });
});
