import { Role } from "@gc-digital-talent/graphql";

import { GraphQLContext } from "./graphql";
import { apiCache } from "./cache";

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
  let roles = apiCache.get("roles");
  if (!roles) {
    const res = await ctx.post<{ roles: Role[] }>(Test_RolesQueryDocument);

    roles = res?.roles ?? [];

    apiCache.set("roles", roles);
  }

  return roles;
}
