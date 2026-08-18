import type { OperationContext } from "@urql/core";

import { shouldUseProtectedEndpoint } from "./protectedEndpointExchange";

const buildContext = (
  overrides?: Partial<OperationContext>,
): OperationContext => ({
  url: "/graphql",
  requestPolicy: "cache-first",
  ...overrides,
});

describe("protected endpoint exchange", () => {
  test("uses protected endpoint for admin path", () => {
    expect(
      shouldUseProtectedEndpoint("/en/admin/settings", buildContext()),
    ).toBe(true);
  });

  test("uses protected endpoint when operation context forces it", () => {
    const context = buildContext({
      forceProtectedEndpoint: true,
    } satisfies Partial<OperationContext>);

    expect(
      shouldUseProtectedEndpoint("/en/communities/talent-events", context),
    ).toBe(true);
  });

  test("does not use protected endpoint for regular path without override", () => {
    expect(
      shouldUseProtectedEndpoint(
        "/en/communities/talent-events",
        buildContext(),
      ),
    ).toBe(false);
  });
});
