import { Classification } from "@gc-digital-talent/graphql";

import { GraphQLRequestFunc, GraphQLResponse } from "./graphql";
import { apiCache } from "./cache";

const Test_ClassificationsQueryDocument = /* GraphQL */ `
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
 * Get all the classifications directly from the API.
 */
export const getClassifications: GraphQLRequestFunc<Classification[]> = async (
  ctx,
) => {
  let classifications = apiCache.get("classifications");
  if (!classifications) {
    classifications =
      (await ctx
        .post(Test_ClassificationsQueryDocument)
        .then(
          (res: GraphQLResponse<"classifications", Classification[]>) =>
            res.classifications,
        )) ?? [];

    apiCache.set("classifications", classifications);
  }

  return classifications;
};
