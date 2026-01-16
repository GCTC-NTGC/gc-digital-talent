import { ACCESS_TOKEN } from "@gc-digital-talent/auth";
import { graphql } from "@gc-digital-talent/graphql";

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

const userMiddleware: Route.ClientMiddlewareFunction = async (
  { context },
  next,
) => {
  try {
    if (context.get(userContext)) {
      return next();
    }

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      context.set(userContext, null);
      return next();
    }

    const client = context.get(graphqlClientContext);
    const result = await client.query(UserMiddleware_Query, {}).toPromise();

    context.set(userContext, result.data?.myAuth ?? null);

    return next();
  } catch {
    context.set(userContext, null);

    return next();
  }
};

export default userMiddleware;
