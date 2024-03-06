import {
  CreatePoolMutation,
  UpdatePoolMutation,
  PublishPoolMutation,
  CreatePoolSkillMutation,
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

Cypress.Commands.add("createPool", (userId, teamId, classificationIds) => {
  // there are no optional fields on the variables for this mutation
  cy.graphqlRequest<CreatePoolMutation>({
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

const commandUpdatePoolDoc = /* GraphQL */ `
  mutation Command_UpdatePool($id: ID!, $pool: UpdatePoolInput!) {
    updatePool(id: $id, pool: $pool) {
      id
    }
  }
`;

Cypress.Commands.add("updatePool", (id, pool) => {
  cy.graphqlRequest<UpdatePoolMutation>({
    operationName: "Command_UpdatePool",
    query: commandUpdatePoolDoc,
    variables: {
      id: id,
      pool: pool,
    },
  }).then((data) => {
    cy.wrap(data.updatePool);
  });
});

const commandCreatePoolSkillDoc = /* GraphQL */ `
  mutation Command_CreatePoolSkill(
    $poolId: ID!
    $skillId: ID!
    $poolSkill: CreatePoolSkillInput!
  ) {
    createPoolSkill(poolId: $poolId, skillId: $skillId, poolSkill: $poolSkill) {
      id
    }
  }
`;

Cypress.Commands.add("createPoolSkill", (poolId, skillId, poolSkill) => {
  cy.graphqlRequest<CreatePoolSkillMutation>({
    operationName: "Command_CreatePoolSkill",
    query: commandCreatePoolSkillDoc,
    variables: {
      poolId: poolId,
      skillId: skillId,
      poolSkill: poolSkill,
    },
  }).then((data) => {
    cy.wrap(data.createPoolSkill);
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

Cypress.Commands.add("publishPool", (id) => {
  cy.graphqlRequest<PublishPoolMutation>({
    operationName: "Command_PublishPool",
    query: commandPublishPoolDoc,
    variables: {
      id: id,
    },
  }).then((data) => {
    cy.wrap(data.publishPool);
  });
});
