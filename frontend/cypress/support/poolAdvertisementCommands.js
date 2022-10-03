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
  cy.request({
    method: "POST",
    url: "/graphql",
    auth: {
      bearer: window.localStorage.getItem("access_token"),
    },
    body: {
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
    },
  }).then((resp) => {
    if (resp.body.errors)
      throw new Error("Errors: " + JSON.stringify(resp.body.errors));
    cy.wrap(resp.body.data.createPoolAdvertisement);
  });
});

Cypress.Commands.add("updatePoolAdvertisement", (id, poolAdvertisement) => {
  cy.request({
    method: "POST",
    url: "/graphql",
    auth: {
      bearer: window.localStorage.getItem("access_token"),
    },
    body: {
      operationName: "updatePoolAdvertisement",
      query: getGqlString(UpdatePoolAdvertisementDocument),
      variables: {
        id: id,
        poolAdvertisement: poolAdvertisement,
      },
    },
  }).then((resp) => {
    if (resp.body.errors)
      throw new Error("Errors: " + JSON.stringify(resp.body.errors));
    cy.wrap(resp.body.data.updatePoolAdvertisement);
  });
});

Cypress.Commands.add("publishPoolAdvertisement", (id) => {
  cy.request({
    method: "POST",
    url: "/graphql",
    auth: {
      bearer: window.localStorage.getItem("access_token"),
    },
    body: {
      operationName: "publishPoolAdvertisement",
      query: getGqlString(PublishPoolAdvertisementDocument),
      variables: {
        id: id,
      },
    },
  }).then((resp) => {
    if (resp.body.errors)
      throw new Error("Errors: " + JSON.stringify(resp.body.errors));
    cy.wrap(resp.body.data.publishPoolAdvertisement);
  });
});
