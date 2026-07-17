import type { OperationContext } from "@urql/core";

import { protectedEndpointContext } from "@gc-digital-talent/client";

// Sets the forceProtectedEndpoint flag so protectedEndpointExchange routes
// the operation to the protected API endpoint, even when the current route is not /admin.

// Use when passing context as a positional argument, e.g. executeMutation(variables, getProtectedOperationContext())
export const getProtectedOperationContext = (): Partial<OperationContext> =>
  protectedEndpointContext();
