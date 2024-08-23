import { Role } from "@gc-digital-talent/graphql";

import { GraphQLContext, GraphQLResponse } from "./graphql";

const Test_RolesQueryDocument = /* GraphQL */ `
  query Test_Roles {
    roles {
      id
      name
    }
  }
`;

/**
 * Get Roles
 *
 * Get all the roles directly from the API.
 */
export async function getRoles(ctx: GraphQLContext): Promise<Role[]> {
  return await ctx
    .post(Test_RolesQueryDocument)
    .then((res: GraphQLResponse<"roles", Role[]>) => res.roles);
}
