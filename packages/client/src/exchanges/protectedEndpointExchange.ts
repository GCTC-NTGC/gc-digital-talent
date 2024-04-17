import { pipe, tap } from "wonka";
import type { Exchange } from "@urql/core";

const protectedPaths = ["/admin", "/en/admin", "/fr/admin"];

// A custom exchange that changes to the protected endpoint depending on the current location

const protectedEndpointExchange: Exchange =
  ({ forward }) =>
  (ops$) =>
    pipe(
      ops$,
      tap((op) => {
        const isProtectedLocation = protectedPaths.some(
          (path) =>
            window.location.pathname === path ||
            window.location.pathname.startsWith(`${path}/`),
        );
        if (isProtectedLocation) {
          op.context.url = "/admin/graphql";
        }
      }),
      forward,
    );

export default protectedEndpointExchange;
