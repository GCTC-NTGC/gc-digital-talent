import { createContext, MiddlewareFunction } from "react-router";

import { ACCESS_TOKEN, hasRole, RoleName } from "@gc-digital-talent/auth";
import { graphql, Maybe, UserAuthInfo } from "@gc-digital-talent/graphql";
import { UnauthorizedError } from "@gc-digital-talent/helpers";

import { clientContext } from "./clientMiddleware";

type UserContext = Maybe<Partial<UserAuthInfo>>;

export const userContext = createContext<UserContext>();

const UserMiddleware_Query = graphql(/** GraphQL */ `
  query UserMiddleware {
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

export function guardByRoles(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: RouteContext<any>,
  roles: RoleName[],
) {
  const user = context.get(userContext) as Maybe<Partial<UserAuthInfo>>;
  const isAuthorized = hasRole(roles, user?.roleAssignments);

  if (!isAuthorized) {
    throw new UnauthorizedError();
  }
}

const userMiddleware: MiddlewareFunction = async ({ context }, next) => {
  // User is not logged in so set undefined
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    context.set(userContext, null);
    return next();
  }

  const client = context.get(clientContext);

  const user = await client.query(UserMiddleware_Query, {}).toPromise();

  context.set(userContext, user.data?.myAuth ?? null);

  return next();
};

export default userMiddleware;
