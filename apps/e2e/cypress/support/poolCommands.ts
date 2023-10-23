import {
  CreatePoolMutation,
  PublishPoolMutation,
  UpdatePoolMutation,
  CreatePoolDocument,
  UpdatePoolDocument,
  PublishPoolDocument,
} from "@gc-digital-talent/graphql";

import { getGqlString } from "./graphql-test-utils";

Cypress.Commands.add("createPool", (userId, teamId, classificationIds) => {
  // there are no optional fields on the variables for this mutation
  cy.graphqlRequest<CreatePoolMutation>({
    operationName: "createPool",
    query: getGqlString(CreatePoolDocument),
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
