import {
  CreateTeamMutation,
  CreateTeamDocument,
} from "@gc-digital-talent/web/src/api/generated";

import { Command_AllTeamsQuery, graphql } from "@gc-digital-talent/graphql";
import { getGqlString } from "./graphql-test-utils";

const commandAllTeamsDoc = /* GraphQL */ `
  query Command_AllTeams {
    teams {
      id
      name
      displayName {
        en
        fr
      }
    }
  }
`;

const Command_AllTeamsQuery = graphql(commandAllTeamsDoc);

Cypress.Commands.add("getDCM", () => {
  cy.graphqlRequest<Command_AllTeamsQuery>({
    operationName: "Command_AllTeams",
    query: commandAllTeamsDoc,
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
  cy.graphqlRequest<Command_AllTeamsQuery>({
    operationName: "Command_AllTeams",
    query: commandAllTeamsDoc,
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
