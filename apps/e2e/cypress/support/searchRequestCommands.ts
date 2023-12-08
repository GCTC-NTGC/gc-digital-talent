import {
  CreatePoolCandidateSearchRequestMutation,
  UpdatePoolCandidateSearchRequestMutation,
  CreatePoolCandidateSearchRequestDocument,
  UpdatePoolCandidateSearchRequestDocument,
} from "@gc-digital-talent/web/src/api/generated";

import { getGqlString } from "./graphql-test-utils";

Cypress.Commands.add(
  "createPoolCandidateSearchRequest",
  (poolCandidateSearchRequest) => {
    cy.graphqlRequest<CreatePoolCandidateSearchRequestMutation>({
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
    cy.graphqlRequest<UpdatePoolCandidateSearchRequestMutation>({
      operationName: "updatePoolCandidateSearchRequest",
      query: getGqlString(UpdatePoolCandidateSearchRequestDocument),
      variables: {
        id: id,
        poolCandidateSearchRequest: poolCandidateSearchRequest,
      },
    }).then((data) => {
      cy.wrap(data.updatePoolCandidateSearchRequest);
    });
  },
);
