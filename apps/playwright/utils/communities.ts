import { Community } from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";

const Test_CommunitiesQueryDocument = /* GraphQL */ `
  query Test_Communities {
    communities {
      id
      name {
        en
        fr
      }
      teamIdForRoleAssignment
    }
  }
`;

/**
 * Get Communities
 *
 * Get all the communities directly from the API.
 */
export const getCommunities: GraphQLRequestFunc<Community[]> = async (ctx) => {
  return await ctx
    .post(Test_CommunitiesQueryDocument)
    .then(
      (res: GraphQLResponse<"communities", Community[]>) => res.communities,
    );
};
