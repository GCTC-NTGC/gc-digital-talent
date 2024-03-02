import {
  Command_CreatePoolMutation,
  Command_UpdatePoolMutation,
  Command_PublishPoolMutation,
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
      userId,
      teamId,
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

const commandUpdatePoolDoc = /* GraphQL */ `
  mutation Command_UpdatePool($id: ID!, $pool: UpdatePoolInput!) {
    updatePool(id: $id, pool: $pool) {
      id
    }
  }
`;

const Command_UpdatePoolMutation = graphql(commandUpdatePoolDoc);

Cypress.Commands.add("updatePool", (id, pool) => {
  cy.graphqlRequest<Command_UpdatePoolMutation>({
    operationName: "Command_UpdatePool",
    query: commandUpdatePoolDoc,
    variables: {
      id,
      pool,
    },
  }).then((data) => {
    cy.wrap(data.updatePool);
  });
});

const commandPublishPoolDoc = /* GraphQL */ `
  mutation Command_PublishPool($id: ID!) {
    publishPool(id: $id) {
      id
      publishedAt
    }
  }
`;

const Command_PublishPoolMutation = graphql(commandPublishPoolDoc);

Cypress.Commands.add("publishPool", (id) => {
  cy.graphqlRequest<Command_PublishPoolMutation>({
    operationName: "Command_PublishPool",
    query: commandPublishPoolDoc,
    variables: {
      id,
    },
  }).then((data) => {
    cy.wrap(data.publishPool);
  });
});
