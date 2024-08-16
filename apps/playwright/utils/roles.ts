import { Role } from "@gc-digital-talent/graphql";

import { GraphQLContext } from "./graphql";

export const Test_RolesQueryDocument = /* GraphQL */ `
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
 * Get all the roles directly from
 * the API.
 */
export async function getRoles(ctx: GraphQLContext): Promise<Role[]> {
  const res = await ctx.post(Test_RolesQueryDocument);

  return res.roles;
}

export const Test_UpdateUserRolesMutationDocument = /* GraphQL */ `
  mutation Test_UpdateUserRoles($updateUserRolesInput: UpdateUserRolesInput!) {
    updateUserRoles(updateUserRolesInput: $updateUserRolesInput) {
      id
      roleAssignments {
        id
        role {
          id
          name
          isTeamBased
          displayName {
            en
            fr
          }
        }
        team {
          id
          name
          displayName {
            en
            fr
          }
        }
      }
    }
  }
`;
