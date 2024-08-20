import { Role } from "@gc-digital-talent/graphql";

import { GraphQLContext } from "./graphql";

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
  const res = await ctx.post(Test_RolesQueryDocument);

  return res.roles;
}
