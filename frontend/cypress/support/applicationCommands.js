import { CreateApplicationDocument, SubmitApplicationDocument } from "../../talentsearch/src/js/api/generated"
import { UpdatePoolCandidateStatusDocument } from "../../admin/src/js/api/generated";

function getGqlString(doc) {
  return doc.loc && doc.loc.source.body;
}

Cypress.Commands.add('createApplication', (userId, poolId) => {
  cy.request({
    method: 'POST',
    url: '/graphql',
    auth: {
      bearer: window.localStorage.getItem('access_token'),
    },
    body: {
      operationName: 'createApplication',
      query: getGqlString(CreateApplicationDocument),
      variables: {
        userId,
        poolId
      },
    },
  })
  .then((resp) => {
    if (resp.body.errors) throw new Error("Errors: " + JSON.stringify(resp.body.errors))
    cy.wrap(resp.body.data.createApplication);
  });
});

Cypress.Commands.add('submitApplication', (applicationId, signature) => {
  cy.request({
    method: 'POST',
    url: '/graphql',
    auth: {
      bearer: window.localStorage.getItem('access_token'),
    },
    body: {
      operationName: 'submitApplication',
      query: getGqlString(SubmitApplicationDocument),
      variables: {
        id: applicationId,
        signature
      },
    },
  })
  .then((resp) => {
    if (resp.body.errors) throw new Error("Errors: " + JSON.stringify(resp.body.errors))
    cy.wrap(resp.body.data.submitApplication);
  });
});

Cypress.Commands.add('updatePoolCandidateAsAdmin', (applicationId, updatePoolCandidateAsAdminInput) => {
  cy.request({
    method: 'POST',
    url: '/graphql',
    auth: {
      bearer: window.localStorage.getItem('access_token'),
    },
    body: {
      operationName: 'UpdatePoolCandidateStatus',
      query: getGqlString(UpdatePoolCandidateStatusDocument),
      variables: {
        id: applicationId,
        input: updatePoolCandidateAsAdminInput
      },
    },
  })
  .then((resp) => {
    if (resp.body.errors) throw new Error("Errors: " + JSON.stringify(resp.body.errors))
    cy.wrap(resp.body.data.updatePoolCandidateAsAdmin);
  });
});
