import type { OperationContext } from "@urql/core";

import { protectedEndpointContext } from "@gc-digital-talent/client";

// Both helpers set the forceProtectedEndpoint flag so protectedEndpointExchange routes
// the operation to the protected API endpoint, even when the current route is not /admin.
// Two helpers exist because URQL has two different calling conventions:

// Use when passing context as a positional argument, e.g. executeMutation(variables, getProtectedOperationContext())
export const getProtectedOperationContext = (): Partial<OperationContext> =>
  protectedEndpointContext();

// Use when spreading into a useQuery options object, e.g. useQuery({ query, ...getProtectedQueryContextOptions() })
export const getProtectedQueryContextOptions = (): {
  context: Partial<OperationContext>;
} => ({
  context: getProtectedOperationContext(),
});
