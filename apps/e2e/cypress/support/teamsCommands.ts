import {
  Command_AllTeamsQuery,
  Command_CreateTeamMutation,
  graphql,
} from "@gc-digital-talent/graphql";

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

const commandCreateTeamDoc = /* GraphQL */ `
  mutation Command_CreateTeam($team: CreateTeamInput!) {
    createTeam(team: $team) {
      id
    }
  }
`;

const Command_CreateTeamMutation = graphql(commandAllTeamsDoc);

Cypress.Commands.add("createTeam", (team) => {
  cy.graphqlRequest<Command_CreateTeamMutation>({
    operationName: "Command_CreateTeam",
    query: commandCreateTeamDoc,
    variables: {
      team,
    },
  }).then((data) => {
    cy.wrap(data.createTeam);
  });
});
