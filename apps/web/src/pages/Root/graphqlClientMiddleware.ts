import { getClient } from "@gc-digital-talent/client";

import { graphqlClientContext, intlContext } from "~/routing/context";

import type { Route } from "./+types/RootRoute";

const graphqlClientMiddleware: Route.ClientMiddlewareFunction = (
  { context },
  next,
) => {
  const intl = context.get(intlContext);
  const client = getClient({ intl });
  context.set(graphqlClientContext, client);
  return next();
};

export default graphqlClientMiddleware;
