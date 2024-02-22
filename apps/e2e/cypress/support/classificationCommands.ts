import {
  graphql,
  Command_ClassificationsQuery,
} from "@gc-digital-talent/graphql";

const commandClassificationsDoc = /* GraphQL */ `
  query Command_Classifications {
    classifications {
      id
    }
  }
`;

const Command_ClassificationsQuery = graphql(commandClassificationsDoc);

Cypress.Commands.add("getClassifications", () => {
  cy.graphqlRequest<Command_ClassificationsQuery>({
    operationName: "Command_Classifications",
    query: commandClassificationsDoc,
    variables: {},
  }).then((data) => {
    cy.wrap(data.classifications);
  });
});
