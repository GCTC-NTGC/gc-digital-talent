import {
  CreatePoolAdvertisementDocument,
  UpdatePoolAdvertisementDocument,
  PublishPoolAdvertisementDocument,
} from "../../admin/src/js/api/generated";

function getGqlString(doc) {
  return doc.loc && doc.loc.source.body;
}

Cypress.Commands.add("createPoolAdvertisement", (userId, classificationIds) => {
  // there are no optional fields on the variables for this mutation
  cy.graphqlRequest({
    operationName: "createPoolAdvertisement",
    query: getGqlString(CreatePoolAdvertisementDocument),
    variables: {
      userId: userId,
      poolAdvertisement: {
        classifications: {
          sync: classificationIds,
        },
      },
    },
  }).then((data) => {
    cy.wrap(data.createPoolAdvertisement);
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
