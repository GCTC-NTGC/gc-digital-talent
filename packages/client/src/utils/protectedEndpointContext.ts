import type { OperationContext } from "@urql/core";

const FORCE_PROTECTED_ENDPOINT_CONTEXT_KEY = "forceProtectedEndpoint";

export const protectedEndpointContext = (): Partial<OperationContext> =>
  ({
    [FORCE_PROTECTED_ENDPOINT_CONTEXT_KEY]: true,
  }) as Partial<OperationContext>;

export const hasForcedProtectedEndpoint = (
  context: OperationContext,
): boolean => {
  return Boolean(
    (context as Record<string, unknown>)[FORCE_PROTECTED_ENDPOINT_CONTEXT_KEY],
  );
};
