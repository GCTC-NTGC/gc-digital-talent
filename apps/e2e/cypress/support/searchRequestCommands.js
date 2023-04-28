import {
  CreatePoolCandidateSearchRequestDocument,
  UpdatePoolCandidateSearchRequestDocument,
} from "@gc-digital-talent/web/src/api/generated";

function getGqlString(doc) {
  return doc.loc && doc.loc.source.body;
}

Cypress.Commands.add(
  "createPoolCandidateSearchRequest",
  (poolCandidateSearchRequest) => {
    cy.graphqlRequest({
      operationName: "createPoolCandidateSearchRequest",
      query: getGqlString(CreatePoolCandidateSearchRequestDocument),
      variables: {
        poolCandidateSearchRequest: poolCandidateSearchRequest,
      },
    }).then((data) => {
      cy.wrap(data.createPoolCandidateSearchRequest);
    });
  },
);

Cypress.Commands.add(
  "updatePoolCandidateSearchRequest",
  (id, poolCandidateSearchRequest) => {
    cy.graphqlRequest({
      operationName: "updatePoolCandidateSearchRequest",
      query: getGqlString(UpdatePoolCandidateSearchRequestDocument),
      variables: {
        id: id,
        poolCandidateSearchRequest: poolCandidateSearchRequest,
      },
    }).then((data) => {
      cy.wrap(data.UpdatePoolCandidateSearchRequest);
    });
  },
);
