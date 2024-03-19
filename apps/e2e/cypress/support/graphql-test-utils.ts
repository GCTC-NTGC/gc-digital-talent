// Source: https://docs.cypress.io/guides/testing-strategies/working-with-graphql

// eslint-disable-next-line import/no-unresolved
import { CyHttpMessages } from "cypress/types/net-stubbing";

type GraphqlRequest = CyHttpMessages.IncomingHttpRequest & {
  alias?: string;
  body: Request["body"] & {
    operationName?: string;
  };
};

// Utility to match GraphQL mutation based on the operation name
export const hasOperationName = (
  req: GraphqlRequest,
  operationName: string,
) => {
  const { body } = req;
  return (
    // eslint-disable-next-line no-prototype-builtins
    body.hasOwnProperty("operationName") && body.operationName === operationName
  );
};

// Alias query if operationName matches
export const aliasQuery = (req: GraphqlRequest, operationName: string) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Query`;
  }
};

// Alias mutation if operationName matches
export const aliasMutation = (req: GraphqlRequest, operationName: string) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Mutation`;
  }
};
