import type { Classification } from "@gc-digital-talent/graphql";

import type { GraphQLRequestFunc, GraphQLResponse } from "./graphql";

const Test_ClassificationsQueryDocument = /* GraphQL */ `
  query Test_Classifications {
    classifications(availableInSearch: true) {
      id
      group
      level
      groupAndLevel
      displayName
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
    .post<
      GraphQLResponse<"classifications", Classification[]>
    >(Test_ClassificationsQueryDocument)
    .then((res) => res.classifications);
};
