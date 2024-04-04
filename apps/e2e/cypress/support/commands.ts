// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// See: https://testing-library.com/docs/cypress-testing-library/intro/
import "@testing-library/cypress/add-commands";
import * as url from "url";

import * as verifyDownloads from "cy-verify-downloads";

before(() => {
  cy.log(
    "Need to add a custom command? Add it to `cypress/support/commands.js`",
  );

  /* Tips
   * - custom commands may use the UI in a pinch, but ideally should not.
   *   Rather, they should use `cy.request()` as much as possible. This is
   *   faster. A test should exist to tests the UI itself, and so commands
   *   shouldn't need to drive the browser and make as many assertions.
   *   - Example: https://docs.cypress.io/api/cypress-api/custom-commands#Log-in-command-using-request
   */
});

/**
 * Assuming "cy.request" was called with `{followRedirect: false}` grabs the
 * redirectedToUrl, confirms it has proper tokens and sets them in
 * localStorage.
 */
const setLocalStorageTokensFromResponse = (resp) => {
  const uri = url.parse(resp.redirectedToUrl, true);

  // Confirm we have token parts from query params.
  expect(uri.query).to.have.property("id_token");
  expect(uri.query).to.have.property("access_token");
  expect(uri.query).to.have.property("refresh_token");

  cy.window().then((browserWindow) => {
    // Store tokens in localStorage.
    browserWindow.localStorage.setItem("id_token", String(uri.query.id_token));
    browserWindow.localStorage.setItem(
      "access_token",
      String(uri.query.access_token),
    );
    browserWindow.localStorage.setItem(
      "refresh_token",
      String(uri.query.refresh_token),
    );
  });
};

const login = (authorizeReqOptions = {}) => {
  cy.request({ url: "/login", followRedirect: false }).then((resp) => {
    cy.wrap(resp.redirectedToUrl).as("oauth2AuthorizeUrl");
  });
  cy.get<string>("@oauth2AuthorizeUrl").then((reqUrl) => {
    cy.request({
      url: reqUrl,
      followRedirect: false,
      ...authorizeReqOptions,
    }).then((resp) => {
      cy.wrap(resp.redirectedToUrl).as("appCallbackUrl");
    });
  });
  cy.get<string>("@appCallbackUrl").then((reqUrl) => {
    cy.request({ url: reqUrl, followRedirect: false }).then(
      setLocalStorageTokensFromResponse,
    );
  });
};

// Logs in by subject
// Works only when mock-oauth2-server.json has set interactiveLogin:TRUE
const loginBySubject = (subject: string) => {
  const authorizeReqOptions = {
    method: "POST",
    form: true,
    body: {
      username: subject,
    },
  };
  login(authorizeReqOptions);
};

// Logs in by role, using email from `fixtures/users.json`.
// Works only when mock-oauth2-server.json has set interactiveLogin:TRUE
// Current options: admin
const loginByRole = (userRole = "admin") => {
  cy.fixture("users.json").then((users) => {
    const user = users[userRole];
    loginBySubject(user.subject);
  });
};

verifyDownloads.addCustomCommand();

Cypress.Commands.add("setLocale", (locale) => {
  window.localStorage.setItem("stored_locale", locale);
});

Cypress.Commands.add("loginByRole", (role) => {
  loginByRole(role);
});

Cypress.Commands.add("loginBySubject", (sub) => {
  loginBySubject(sub);
});

// Performs logout actions that the app would normally perform on its own.
Cypress.Commands.add("logout", () => {
  window.localStorage.removeItem("refresh_token");
  window.localStorage.removeItem("id_token");
  window.localStorage.removeItem("access_token");
});

// Check if a toast is displayed
Cypress.Commands.add("expectToast", (text) => {
  cy.contains("[role='alert']", text);
});

// issue an authenticated graphql request
Cypress.Commands.add("graphqlRequest", (body) => {
  cy.request({
    method: "POST",
    url: "/graphql",
    auth: {
      bearer: window.localStorage.getItem("access_token"),
    },
    body,
  }).then((resp) => {
    if (resp.body.errors)
      throw new Error(`Errors: ${JSON.stringify(resp.body.errors)}`);
    cy.wrap(resp.body.data);
  });
});
