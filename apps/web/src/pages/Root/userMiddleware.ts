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
  // User is not logged in so set null
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    context.set(userContext, null);
    return next();
  }

  const client = context.get(graphqlClientContext);

  const user = await client.query(UserMiddleware_Query, {}).toPromise();

  context.set(userContext, user.data?.myAuth ?? null);

  return next();
};

export default userMiddleware;
