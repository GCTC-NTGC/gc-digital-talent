import { GetClassificationsDocument } from "@gc-digital-talent/web/src/api/generated";

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
