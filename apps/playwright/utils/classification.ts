import { Classification } from "@gc-digital-talent/graphql";

import { graphqlRequest } from "./graphql";

export const Test_ClassificationsQueryDocument = /* GraphQL */ `
  query Test_Classifications {
    classifications {
      id
      group
      level
    }
  }
`;

/**
 * Get Classifications
 *
 * Get all the classifications directly from
 * the API.
 */
export async function getClassifications(): Promise<Classification[]> {
  const res = await graphqlRequest(Test_ClassificationsQueryDocument);

  return res.classifications;
}
