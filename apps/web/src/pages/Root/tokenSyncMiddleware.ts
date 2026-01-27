import { redirect } from "react-router";

import { setTokensFromLocation } from "@gc-digital-talent/auth";

import type { Route } from "./+types/RootRoute";

const tokenSyncMiddleware: Route.ClientMiddlewareFunction = (
  { request },
  next,
) => {
  const url = new URL(request.url);
  const tokensFound = setTokensFromLocation(url);

  if (tokensFound) {
    // saved in local storage, then clear query parameters.
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect(url.pathname);
  }

  return next();
};

export default tokenSyncMiddleware;
