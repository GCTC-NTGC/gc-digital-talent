import { AllSkillsDocument } from "../../admin/src/js/api/generated"

function getGqlString(doc) {
  return doc.loc && doc.loc.source.body;
}

Cypress.Commands.add('getSkills', () => {
  cy.request({
    method: 'POST',
    url: '/graphql',
    auth: {
      bearer: window.localStorage.getItem('access_token'),
    },
    body: {
      operationName: 'AllSkills',
      query: getGqlString(AllSkillsDocument),
      variables: { },
    },
  })
  .then((resp) => {
    if (resp.body.errors) throw new Error("Errors: " + JSON.stringify(resp.body.errors))
    cy.wrap(resp.body.data.skills);
  });


})
