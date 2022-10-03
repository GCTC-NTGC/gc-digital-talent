import { GetGenericJobTitlesDocument } from "../../admin/src/js/api/generated"

function getGqlString(doc) {
  return doc.loc && doc.loc.source.body;
}

Cypress.Commands.add('getGenericJobTitles', () => {
  cy.request({
    method: 'POST',
    url: '/graphql',
    auth: {
      bearer: window.localStorage.getItem('access_token'),
    },
    body: {
      operationName: 'GetGenericJobTitles',
      query: getGqlString(GetGenericJobTitlesDocument),
      variables: { },
    },
  })
  .then((resp) => {
    if (resp.body.errors) throw new Error("Errors: " + JSON.stringify(resp.body.errors))
    cy.wrap(resp.body.data.genericJobTitles);
  });


})
