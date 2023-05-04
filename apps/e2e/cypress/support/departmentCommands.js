import { DepartmentsDocument } from "@gc-digital-talent/web/src/api/generated";

function getGqlString(doc) {
  return doc.loc && doc.loc.source.body;
}

Cypress.Commands.add("getDepartments", () => {
  cy.graphqlRequest({
    operationName: "departments",
    query: getGqlString(DepartmentsDocument),
    variables: {},
  }).then((data) => {
    cy.wrap(data.departments);
  });
});
