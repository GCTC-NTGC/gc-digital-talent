import { pipe, tap } from "wonka";
import type { Exchange } from "@urql/core";

const protectedPaths = ["/admin", "/en/admin", "/fr/admin"];
const protectedUrl = process.env.API_PROTECTED_URI ?? "";

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
          // we're updating the operation on the fly
          // eslint-disable-next-line no-param-reassign
          op.context.url = protectedUrl;
        }
      }),
      forward,
    );

export default protectedEndpointExchange;
