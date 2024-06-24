import { pipe, tap } from "wonka";
import type { Exchange } from "@urql/core";

import { apiHost, protectedUrl } from "../constants";

const privilegedPaths = [
  "/admin",
  "/en/admin",
  "/fr/admin",
  "/directive-on-digital-talent",
  "/en/directive-on-digital-talent",
  "/fr/directive-on-digital-talent",
];

// A custom exchange that changes to the protected endpoint depending on the current location

const protectedEndpointExchange: Exchange =
  ({ forward }) =>
  (ops$) =>
    pipe(
      ops$,
      tap((op) => {
        const isPrivilegedLocation = privilegedPaths.some(
          (path) =>
            window.location.pathname === path ||
            window.location.pathname.startsWith(`${path}/`),
        );
        if (isPrivilegedLocation) {
          // we're updating the operation on the fly
          // eslint-disable-next-line no-param-reassign
          op.context.url = `${apiHost}${protectedUrl}`;
        }
      }),
      forward,
    );

export default protectedEndpointExchange;
