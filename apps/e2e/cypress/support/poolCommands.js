import {
  CreatePoolDocument,
  UpdatePoolDocument,
  PublishPoolDocument,
} from "@gc-digital-talent/web/src/api/generated";

function getGqlString(doc) {
  return doc.loc && doc.loc.source.body;
}

Cypress.Commands.add("createPool", (userId, teamId, classificationIds) => {
  // there are no optional fields on the variables for this mutation
  cy.graphqlRequest({
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
  cy.graphqlRequest({
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
  cy.graphqlRequest({
    operationName: "publishPool",
    query: getGqlString(PublishPoolDocument),
    variables: {
      id: id,
    },
  }).then((data) => {
    cy.wrap(data.publishPool);
  });
});
