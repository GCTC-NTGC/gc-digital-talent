import type { OperationContext } from "@urql/core";

import { protectedEndpointContext } from "@gc-digital-talent/client";

export const getProtectedOperationContext = (): Partial<OperationContext> =>
  protectedEndpointContext();

export const getProtectedQueryContextOptions = (): {
  context: Partial<OperationContext>;
} => ({
  context: getProtectedOperationContext(),
});
