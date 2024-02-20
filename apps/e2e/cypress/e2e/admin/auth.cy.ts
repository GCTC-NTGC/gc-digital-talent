import { aliasQuery } from "../../support/graphql-test-utils";

const AUTH_SERVER_ROOT = "http://localhost:8000/oxauth";

describe("Auth flows (development)", () => {
  // Helpers
  const onAuthLoginPage = () => {
    cy.url().should("contain", AUTH_SERVER_ROOT + "/authorize");
  };
  const onLoginInfoPage = () => {
    cy.url().should("contain", "/en/login-info");
  };

  const loginViaUI = (role) => {
    cy.fixture("users.json").then((users) => {
      const user = users[role];
      cy.get("input[name=username]").type(user.email);
    });
    cy.findByText("Sign-in").click();
  };

  // Prepare to intercept/detect relevant GraphQL requests.
  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "AdminDashboard_Query");
    });
  });

  context("Anonymous visitor", () => {
    it("redirects restricted pages to sign in", () => {
      [
        "/en/admin/dashboard",
        "/en/admin/talent-requests",
        "/en/admin/users",
        "/en/admin/settings/classifications",
        "/en/admin/pools",
        "/en/admin/settings/departments",
        "/en/admin/settings/skills",
        "/en/admin/settings/skill-families",
      ].forEach((restrictedPath) => {
        cy.visit(restrictedPath);
        onLoginInfoPage();
      });
    });

    it("redirects app login page to auth login page", () => {
      cy.request({ url: "/login", followRedirect: false }).then((req) => {
        expect(req.redirectedToUrl).to.include(AUTH_SERVER_ROOT + "/authorize");
      });
    });
  });

  context("Login", () => {
    it("sets JWT tokens in local storage", () => {
      expect(localStorage.getItem("id_token")).not.to.exist;
      expect(localStorage.getItem("access_token")).not.to.exist;
      expect(localStorage.getItem("refresh_token")).not.to.exist;

      cy.loginByRole("admin").then(() => {
        expect(localStorage.getItem("id_token")).to.exist;
        expect(localStorage.getItem("access_token")).to.exist;
        expect(localStorage.getItem("refresh_token")).to.exist;
      });
    });

    it("sets cookies on login redirect page", () => {
      cy.getCookie("api_session").should("not.exist");
      cy.getCookie("XSRF-TOKEN").should("not.exist");
      cy.request({ url: "/login", followRedirect: false }).then(() => {
        cy.getCookie("api_session").should("exist");
        cy.getCookie("XSRF-TOKEN").should("exist");
      });
    });

    it("succeeds for an existing admin user", () => {
      cy.visit("/admin");
      // Click sign in button.
      // Limit to nav because two sign in buttons on main page.
      cy.findByRole("navigation", { name: /Main Menu/i }).within(() => {
        cy.findByRole("button", { name: "Sign out" }).should("not.exist");
        cy.findByRole("link", { name: "Sign in" })
          .should("exist")
          .and("be.visible")
          .click();
      });

      onAuthLoginPage();
      loginViaUI("admin");

      cy.url().should(
        "equal",
        Cypress.config().baseUrl + "/en/admin/dashboard",
      );
      // Confirm sign in status via button state.
      cy.findByRole("navigation", { name: /Main Menu/i }).within(() => {
        cy.findByRole("link", { name: "Sign in" }).should("not.exist");
        cy.findByRole("button", { name: "Sign out" })
          .should("exist")
          .and("be.visible");
      });
    });

    it("redirects back to referring page after sign in", () => {
      const initialPath = "/en/admin/users";
      cy.visit(initialPath);
      onLoginInfoPage();
      cy.findAllByRole("link", {
        name: /Continue to GCKey and sign in/i,
      })
        .eq(0)
        .click();
      onAuthLoginPage();
      loginViaUI("admin");

      cy.url().should("equal", Cypress.config().baseUrl + initialPath);
    });
  });

  context("Authenticated as admin", () => {
    beforeEach(() => cy.loginByRole("admin"));

    it("redirects by default to dashboard", () => {
      const onDashboard = () => {
        cy.url().should(
          "match",
          new RegExp(`^${Cypress.config().baseUrl}/en/admin/dashboard$`),
        );
        // Heading won't render until we know user details.
        userDataLoaded();
        cy.findByRole("heading", { name: /^Welcome back,/ })
          .should("exist")
          .and("be.visible");
      };

      const userDataLoaded = () => {
        cy.wait("@gqlAdminDashboard_QueryQuery");
      };

      cy.visit("/admin");
      onDashboard();
    });

    it("performs logout and removes token data from local storage", () => {
      cy.visit("/admin");
      cy.findByRole("button", { name: "Sign out" }).as("logoutToggle");
      cy.get("@logoutToggle")
        .should("exist")
        .and("be.visible")
        .click()
        .then(() => {
          cy.findByRole("alertdialog", { name: "Sign out" }).as("logoutModal");
          cy.get("@logoutModal")
            .should("exist")
            .and("be.visible")
            .findByRole("button", { name: "Sign out" })
            .as("logoutBtn");

          cy.get("@logoutBtn")
            .should("exist")
            .and("be.visible")
            .click()
            .then(() => {
              expect(localStorage.getItem("id_token")).not.to.exist;
              expect(localStorage.getItem("access_token")).not.to.exist;
              expect(localStorage.getItem("refresh_token")).not.to.exist;
            });
        });

      cy.get("@logoutToggle").should("not.exist");
      cy.findByRole("link", { name: "Sign in" })
        .should("exist")
        .and("be.visible");
    });
  });

  context("Authenticated as applicant", () => {
    beforeEach(() => cy.loginByRole("applicant"));

    it("displays a not authorized message if logged in without the admin role", () => {
      /**
       * React error boundaries are bubbling exceptions
       * up, so we need to tell cypress to ignore them
       *
       * REF: https://github.com/cypress-io/cypress/issues/7196#issuecomment-971592350
       */
      cy.on("uncaught:exception", () => false);

      [
        "/en/admin/dashboard",
        "/en/admin/talent-requests",
        "/en/admin/users",
        "/en/admin/settings/classifications",
        "/en/admin/pools",
        "/en/admin/settings/departments",
        "/en/admin/settings/skills",
        "/en/admin/settings/skill-families",
      ].forEach((restrictedPath) => {
        cy.visit(restrictedPath);
        cy.contains("not authorized");
      });
    });
  });
});
