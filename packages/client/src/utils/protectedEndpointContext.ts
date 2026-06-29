import type { OperationContext } from "@urql/core";

// URQL attaches an OperationContext to every query/mutation that flows through the exchange pipeline.
// protectedEndpointExchange intercepts operations and rewrites the URL to the protected API endpoint
// when the current route is under /admin OR when this flag is set. Use protectedEndpointContext()
// at the call site to opt a query into the protected endpoint regardless of the current route.

const FORCE_PROTECTED_ENDPOINT_CONTEXT_KEY = "forceProtectedEndpoint";

// Pass the result as the `context` option on a useQuery/useMutation call to force the protected endpoint.
export const protectedEndpointContext = (): Partial<OperationContext> =>
  ({
    [FORCE_PROTECTED_ENDPOINT_CONTEXT_KEY]: true,
  }) satisfies Partial<OperationContext>;

// Cast required because OperationContext has no index signature for custom keys.
export const hasForcedProtectedEndpoint = (
  context: OperationContext,
): boolean => {
  return Boolean(
    (context as Record<string, unknown>)[FORCE_PROTECTED_ENDPOINT_CONTEXT_KEY],
  );
};
