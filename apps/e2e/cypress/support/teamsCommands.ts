import {
  AllTeamsQuery,
  AllTeamsDocument,
  CreateTeamMutation,
  CreateTeamDocument,
} from "@gc-digital-talent/web/src/api/generated";

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

Cypress.Commands.add("createTeam", (team) => {
  cy.graphqlRequest<CreateTeamMutation>({
    operationName: "CreateTeam",
    query: getGqlString(CreateTeamDocument),
    variables: {
      team,
    },
  }).then((data) => {
    cy.wrap(data.createTeam);
  });
});
