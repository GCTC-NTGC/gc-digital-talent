import {
  Command_CreatePoolCandidateSearchRequestMutation,
  Command_UpdatePoolCandidateSearchRequestMutation,
  graphql,
} from "@gc-digital-talent/graphql";

const commandCreatePoolCandidateSearchRequestDoc = /* GraphQL */ `
  mutation Command_CreatePoolCandidateSearchRequest(
    poolCandidateSearchRequest: CreatePoolCandidateSearchRequestInput!) {
    createPoolCandidateSearchRequest(poolCandidateSearchRequest: $poolCandidateSearchRequest) {
      id
    }
  }
`;

const Command_CreatePoolCandidateSearchRequestMutation = graphql(
  commandCreatePoolCandidateSearchRequestDoc,
);

Cypress.Commands.add(
  "createPoolCandidateSearchRequest",
  (poolCandidateSearchRequest) => {
    cy.graphqlRequest<Command_CreatePoolCandidateSearchRequestMutation>({
      operationName: "Command_CreatePoolCandidateSearchRequest",
      query: commandCreatePoolCandidateSearchRequestDoc,
      variables: {
        poolCandidateSearchRequest: poolCandidateSearchRequest,
      },
    }).then((data) => {
      cy.wrap(data.createPoolCandidateSearchRequest);
    });
  },
);

const commandUpdatePoolCandidateSearchRequestDoc = /* GraphQL */ `
  mutation Command_UpdatePoolCandidateSearchRequest(
    updatePoolCandidateSearchRequest(
    $id: ID!
    $poolCandidateSearchRequest: UpdatePoolCandidateSearchRequestInput! @spread
    ) {
    updatePoolCandidateSearchRequest(id: $id, poolCandidateSearchRequest: $poolCandidateSearchRequest) {
      id
    }
  }
`;

const Command_UpdatePoolCandidateSearchRequestMutation = graphql(
  commandCreatePoolCandidateSearchRequestDoc,
);

Cypress.Commands.add(
  "updatePoolCandidateSearchRequest",
  (id, poolCandidateSearchRequest) => {
    cy.graphqlRequest<Command_UpdatePoolCandidateSearchRequestMutation>({
      operationName: "Command_UpdatePoolCandidateSearchRequest",
      query: commandUpdatePoolCandidateSearchRequestDoc,
      variables: {
        id: id,
        poolCandidateSearchRequest: poolCandidateSearchRequest,
      },
    }).then((data) => {
      cy.wrap(data.updatePoolCandidateSearchRequest);
    });
  },
);
