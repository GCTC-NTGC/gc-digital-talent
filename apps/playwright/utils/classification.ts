import { Classification } from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";

const Test_ClassificationsQueryDocument = /* GraphQL */ `
  query Test_Classifications {
    classifications(availableInSearch: true) {
      id
      group
      level
    }
  }
`;

/**
 * Get Classifications
 *
 * Get all the classifications directly from the API.
 */
export const getClassifications: GraphQLRequestFunc<Classification[]> = async (
  ctx,
) => {
  return await ctx
    .post(Test_ClassificationsQueryDocument)
    .then(
      (res: GraphQLResponse<"classifications", Classification[]>) =>
        res.classifications,
    );
};
