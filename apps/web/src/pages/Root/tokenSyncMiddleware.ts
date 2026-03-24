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
    url.searchParams.delete("token_type");
    url.searchParams.delete("id_token");
    url.searchParams.delete("access_token");
    url.searchParams.delete("refresh_token");
    url.searchParams.delete("expires_in");
    url.searchParams.delete("grant_id");
    url.searchParams.delete("scope");
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect(url.href);
  }

  return next();
};

export default tokenSyncMiddleware;
