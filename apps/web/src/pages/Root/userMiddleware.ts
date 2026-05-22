import { ACCESS_TOKEN } from "@gc-digital-talent/auth";
import type { RolePermission, UserMiddlewareQuery } from "@gc-digital-talent/graphql";
import { graphql } from "@gc-digital-talent/graphql";

import { graphqlClientContext, rolePermissionMapContext, userContext } from "~/routing/context";

import type { Route } from "./+types/RootRoute";

const UserMiddleware_Query = graphql(/** GraphQL */ `
  query UserMiddleware {
    rolePermissions {
      role
      permissions
    }
    myAuth {
      id
      deletedDate
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
        }
      }
    }
  }
`);

let cachedToken: string | null = null;
let cachedUser: UserMiddlewareQuery["myAuth"] | null | undefined = undefined;
let cachedRolePermissionMap: RolePermission[] = [];

const userMiddleware: Route.ClientMiddlewareFunction = async (
  { context },
  next,
) => {
  const token = localStorage.getItem(ACCESS_TOKEN);

  if (!token) {
    cachedToken = null;
    cachedUser = null;
    cachedRolePermissionMap = [];
    context.set(userContext, null);
    context.set(rolePermissionMapContext, []);
    return next();
  }

  if (cachedToken !== token) {
    cachedToken = token;
    cachedUser = undefined;
  }

  if (cachedUser !== undefined) {
    context.set(userContext, cachedUser);
    context.set(rolePermissionMapContext, cachedRolePermissionMap);
    return next();
  }

  const client = context.get(graphqlClientContext);
  const result = await client.query(UserMiddleware_Query, {}).toPromise();
  cachedUser = result.data?.myAuth ?? null;
  cachedRolePermissionMap = (result.data?.rolePermissions ?? []) as RolePermission[];
  context.set(userContext, cachedUser);
  context.set(rolePermissionMapContext, cachedRolePermissionMap);

  return next();
};

export default userMiddleware;
