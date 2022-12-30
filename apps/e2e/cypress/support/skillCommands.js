import { AllSkillsDocument } from "admin/src/js/api/generated";

function getGqlString(doc) {
  return doc.loc && doc.loc.source.body;
}

Cypress.Commands.add("getSkills", () => {
  cy.graphqlRequest({
    operationName: "AllSkills",
    query: getGqlString(AllSkillsDocument),
    variables: {},
  }).then((data) => {
    cy.wrap(data.skills);
  });
});
