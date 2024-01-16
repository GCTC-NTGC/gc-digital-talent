import {
  PublishPoolMutation,
  UpdatePoolMutation,
  UpdatePoolDocument,
  PublishPoolDocument,
} from "@gc-digital-talent/web/src/api/generated";

import { getGqlString } from "./graphql-test-utils";
import {
  Command_CreatePoolMutation,
  graphql,
} from "@gc-digital-talent/graphql";

const commandCreatePoolDoc = /* GraphQL */ `
  mutation Command_CreatePool(
    $userId: ID!
    $teamId: ID!
    $pool: CreatePoolInput!
  ) {
    createPool(userId: $userId, teamId: $teamId, pool: $pool) {
      id
      name {
        en
        fr
      }
    }
  }
`;

const Command_CreatePoolMutation = graphql(commandCreatePoolDoc);

Cypress.Commands.add("createPool", (userId, teamId, classificationIds) => {
  // there are no optional fields on the variables for this mutation
  cy.graphqlRequest<Command_CreatePoolMutation>({
    operationName: "Command_CreatePool",
    query: commandCreatePoolDoc,
    variables: {
      userId: userId,
      teamId: teamId,
      pool: {
        classifications: {
          sync: classificationIds,
        },
      },
    },
  }).then((data) => {
    cy.wrap(data.createPool);
  });
});

Cypress.Commands.add("updatePool", (id, pool) => {
  cy.graphqlRequest<UpdatePoolMutation>({
    operationName: "updatePool",
    query: getGqlString(UpdatePoolDocument),
    variables: {
      id: id,
      pool: pool,
    },
  }).then((data) => {
    cy.wrap(data.updatePool);
  });
});

Cypress.Commands.add("publishPool", (id) => {
  cy.graphqlRequest<PublishPoolMutation>({
    operationName: "publishPool",
    query: getGqlString(PublishPoolDocument),
    variables: {
      id: id,
    },
  }).then((data) => {
    cy.wrap(data.publishPool);
  });
});
