import {
  CreatePoolDocument,
  UpdatePoolAdvertisementDocument,
  PublishPoolAdvertisementDocument,
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

Cypress.Commands.add("updatePoolAdvertisement", (id, poolAdvertisement) => {
  cy.graphqlRequest({
    operationName: "updatePoolAdvertisement",
    query: getGqlString(UpdatePoolAdvertisementDocument),
    variables: {
      id: id,
      poolAdvertisement: poolAdvertisement,
    },
  }).then((data) => {
    cy.wrap(data.updatePoolAdvertisement);
  });
});

Cypress.Commands.add("publishPoolAdvertisement", (id) => {
  cy.graphqlRequest({
    operationName: "publishPoolAdvertisement",
    query: getGqlString(PublishPoolAdvertisementDocument),
    variables: {
      id: id,
    },
  }).then((data) => {
    cy.wrap(data.publishPoolAdvertisement);
  });
});
