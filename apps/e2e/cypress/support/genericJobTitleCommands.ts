import {
  Command_GetGenericJobTitlesQuery,
  graphql,
} from "@gc-digital-talent/graphql";

const commandGetGenericJobTitlesDoc = /* GraphQL */ `
  query Command_GetGenericJobTitles {
    genericJobTitles {
      id
      key
      name {
        en
        fr
      }
      classification {
        id
        name {
          en
          fr
        }
        group
        level
        minSalary
        maxSalary
      }
    }
  }
`;

const Command_GetGenericJobTitlesQuery = graphql(commandGetGenericJobTitlesDoc);

Cypress.Commands.add("getGenericJobTitles", () => {
  cy.graphqlRequest<Command_GetGenericJobTitlesQuery>({
    operationName: "Command_GetGenericJobTitles",
    query: commandGetGenericJobTitlesDoc,
    variables: {},
  }).then((data) => {
    cy.wrap(data.genericJobTitles);
  });
});
