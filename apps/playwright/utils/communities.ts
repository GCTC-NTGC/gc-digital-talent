import { Community } from "@gc-digital-talent/graphql";

import { graphqlRequest } from "./graphql";

export const Test_CommunitiesQueryDocument = /* GraphQL */ `
  query Test_Communities {
    communities {
      id
      name {
        en
        fr
      }
    }
  }
`;

/**
 * Get Communities
 *
 * Get all the communities directly from
 * the API.
 */
export async function getCommunities(): Promise<Community[]> {
  const res = await graphqlRequest(Test_CommunitiesQueryDocument);

  return res.communities;
}
