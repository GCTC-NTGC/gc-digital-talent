import { GetClassificationsDocument } from "../../admin/src/js/api/generated";

function getGqlString(doc) {
  return doc.loc && doc.loc.source.body;
}

Cypress.Commands.add("getClassifications", () => {
  cy.graphqlRequest({
    operationName: "GetClassifications",
    query: getGqlString(GetClassificationsDocument),
    variables: {},
  }).then((data) => {
    cy.wrap(data.classifications);
  });
});
