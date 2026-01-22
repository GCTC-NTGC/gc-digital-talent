import { getClient } from "@gc-digital-talent/client";

import { graphqlClientContext, intlContext } from "~/routing/context";

import type { Route } from "./+types/RootRoute";

let urqlClient: ReturnType<typeof getClient> | null = null;

const graphqlClientMiddleware: Route.ClientMiddlewareFunction = (
  { context },
  next,
) => {
  const intl = context.get(intlContext);
  urqlClient ??= getClient({ intl });
  context.set(graphqlClientContext, urqlClient);
  return next();
};

export default graphqlClientMiddleware;
