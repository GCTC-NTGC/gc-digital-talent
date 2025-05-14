import { Community } from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";
import { apiCache } from "./cache";

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
  let communities = apiCache.get("communities");
  if (!communities) {
    communities =
      (await ctx
        .post(Test_CommunitiesQueryDocument)
        .then(
          (res: GraphQLResponse<"communities", Community[]>) => res.communities,
        )) ?? [];

    apiCache.set("communities", communities);
  }

  return communities;
};
