import { ACCESS_TOKEN } from "@gc-digital-talent/auth";
import { graphql, UserMiddlewareQuery } from "@gc-digital-talent/graphql";

import { graphqlClientContext, userContext } from "~/routing/context";

import type { Route } from "./+types/RootRoute";

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

let cachedToken: string | null = null;
let cachedUser: UserMiddlewareQuery["myAuth"] | null | undefined = undefined;

const userMiddleware: Route.ClientMiddlewareFunction = async (
  { context },
  next,
) => {
  const token = localStorage.getItem(ACCESS_TOKEN);

  if (!token) {
    cachedToken = null;
    cachedUser = null;
    context.set(userContext, null);
    return next();
  }

  if (cachedToken !== token) {
    cachedToken = token;
    cachedUser = undefined;
  }

  if (cachedUser !== undefined) {
    context.set(userContext, cachedUser);
    return next();
  }

  const client = context.get(graphqlClientContext);
  const result = await client.query(UserMiddleware_Query, {}).toPromise();
  cachedUser = result.data?.myAuth ?? null;
  context.set(userContext, cachedUser);

  return next();
};

export default userMiddleware;
