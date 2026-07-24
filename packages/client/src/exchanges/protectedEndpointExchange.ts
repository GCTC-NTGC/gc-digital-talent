import { pipe, tap } from "wonka";
import type { Exchange, OperationContext } from "@urql/core";

import { apiHost, protectedUrl } from "../constants";
import { hasForcedProtectedEndpoint } from "../utils/protectedEndpointContext";

const privilegedPaths = ["/admin", "/en/admin", "/fr/admin"];

export const shouldUseProtectedEndpoint = (
  pathname: string,
  context: OperationContext,
): boolean => {
  const isPrivilegedLocation = privilegedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  return isPrivilegedLocation || hasForcedProtectedEndpoint(context);
};

// A custom exchange that changes to the protected endpoint depending on the current location

const protectedEndpointExchange: Exchange =
  ({ forward }) =>
  (ops$) =>
    pipe(
      ops$,
      tap((op) => {
        if (shouldUseProtectedEndpoint(window.location.pathname, op.context)) {
          // we're updating the operation on the fly
          op.context.url = `${apiHost}${protectedUrl}`;
        }
      }),
      forward,
    );

export default protectedEndpointExchange;
