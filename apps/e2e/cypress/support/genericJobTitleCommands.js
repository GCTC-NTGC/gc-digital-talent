import { GetGenericJobTitlesDocument } from "@gc-digital-talent/web/src/api/generated";

function getGqlString(doc) {
  return doc.loc && doc.loc.source.body;
}

Cypress.Commands.add("getGenericJobTitles", () => {
  cy.graphqlRequest({
    operationName: "GetGenericJobTitles",
    query: getGqlString(GetGenericJobTitlesDocument),
    variables: {},
  }).then((data) => {
    cy.wrap(data.genericJobTitles);
  });
});
