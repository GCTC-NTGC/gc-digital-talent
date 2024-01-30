import { aliasQuery } from "cypress/support/graphql-test-utils";

// https://stackoverflow.com/a/67096081
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
    // it("will show a message when logged in as a deleted user", () => {
    //   // If you log in as a deleted user you end up on the "user deleted" page.
    // });
  });

  context("refresh", () => {
    // will log in and refresh the token successfully
    it("can refresh the token", () => {
      cy.intercept({ pathname: "/refresh*" }).as("refresh");

      // Get a fast-expire token from the mock-auth debugger with default options
      cy.visit("http://localhost:8081/fast-expire/debugger");
      cy.findByRole("button", { name: "Get a token" }).click();

      cy.fixture("users.json").then((users) => {
        const applicantUser = users.applicant;
        cy.get("input[name=username]").type(applicantUser.subject);
      });
      cy.findByRole("button", { name: "Sign-in" }).click();

      cy.findAllByRole("code").then((codeBlocks) => {
        // I wish there was a nicer way to get this
        const tokenResponseBlock = codeBlocks[1];
        const tokenResponse = JSON.parse(tokenResponseBlock.innerText);
        expect(tokenResponse).property("expires_in").to.eq(0);
        cy.wrap(tokenResponse).as("firstTokens");
      });

      // Return to the app with the debugger token response
      cy.get("@firstTokens").then((firstTokens) => {
        const appUrl = new URL(
          "http://localhost:8000/en/applicant/profile-and-applications",
        );
        appUrl.searchParams.set("token_type", firstTokens["token_type"]);
        appUrl.searchParams.set("id_token", firstTokens["id_token"]);
        appUrl.searchParams.set("access_token", firstTokens["access_token"]);
        appUrl.searchParams.set("refresh_token", firstTokens["refresh_token"]);
        appUrl.searchParams.set("expires_in", firstTokens["expires_in"]);
        appUrl.searchParams.set("scope", firstTokens["scope"]);

        cy.visit(appUrl.toString());
      });

      // expect an immediate refresh
      cy.wait("@refresh").then((interception) => {
        cy.get("@firstTokens").then((firstTokens) => {
          // make sure it uses the refresh token
          expect(interception.request.query["refresh_token"]).to.eq(
            firstTokens["refresh_token"],
          );

          const secondTokens = JSON.parse(interception.response.body); //  #9148
          cy.wrap(secondTokens).as("secondTokens");
        });
      });

      // auth context provider will update itself -
      cy.wait("@gqlauthorizationQueryQuery").then((interception) => {
        // make sure we get a user ID back
        expect(interception.response.body)
          .nested.property("data.myAuth.id")
          .matches(uuidRegex);

        cy.get("@secondTokens").then((secondTokens) => {
          // make sure it uses the new access token
          expect(interception.request.headers["authorization"]).to.eq(
            `Bearer ${secondTokens["access_token"]}`,
          );
        });
      });
    });
    // it("can share the refresh", () => {
    //   // When you have two tabs open, a refresh in one will allow the second tab to make an API call with the new tokens and no refresh.
    // });
    // it("can chain two refreshes", () => {
    //   // can chain two refreshes
    // });
  });

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
