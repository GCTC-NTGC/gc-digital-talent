import { AllTeamsQuery, AllTeamsDocument } from "@gc-digital-talent/graphql";

import { getGqlString } from "./graphql-test-utils";

Cypress.Commands.add("getDCM", () => {
  cy.graphqlRequest<AllTeamsQuery>({
    operationName: "allTeams",
    query: getGqlString(AllTeamsDocument),
    variables: {},
  }).then((data) => {
    const teams = data.teams;
    const dcm = teams.filter(
      (team) => team.name === "digital-community-management",
    );
    const dcmId = dcm[0]["id"];
    cy.wrap(dcmId);
  });
});

Cypress.Commands.add("getTeams", () => {
  cy.graphqlRequest<AllTeamsQuery>({
    operationName: "allTeams",
    query: getGqlString(AllTeamsDocument),
    variables: {},
  }).then((data) => {
    cy.wrap(data.teams);
  });
});
