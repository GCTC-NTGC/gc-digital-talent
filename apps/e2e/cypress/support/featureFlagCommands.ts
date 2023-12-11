import * as dotenv from "dotenv";

dotenv.config({ path: "../web/.env" });

const overrideFeatureFlags = (flags: Object) => {
  const env = {
    ...process.env,
    ...flags,
  };

  let map = `const data = new Map();`;
  Object.keys(env).forEach((key) => {
    map = `data.set(${key}, ${env[key]});`;
  });

  return `${map} window.__SERVER_CONFIG__ = data`;
};

Cypress.Commands.add("overrideFeatureFlags", (flags) => {
  cy.intercept("GET", "/config.js", overrideFeatureFlags(flags));
});
