import { describe, it, expect, vi, beforeEach } from "vitest";

import { ACCESS_TOKEN } from "@gc-digital-talent/auth";

vi.mock("pusher-js", () => {
  return {
    default: vi.fn().mockImplementation(function MockPusher(
      this: { __options: unknown },
      _key: string,
      options: unknown,
    ) {
      this.__options = options;
    }),
  };
});

vi.mock("../constants", () => ({
  apiHost: "http://localhost:8000",
  apiUri: "/graphql",
  reverbAppKey: "gcdt",
}));

function currentAuthHeader(pusherInstance: {
  __options: {
    channelAuthorization: { headersProvider: () => Record<string, string> };
  };
}) {
  return pusherInstance.__options.channelAuthorization.headersProvider()
    .Authorization;
}

describe("createPusher auth header freshness", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it("uses the CURRENT localStorage access token, not the one captured at construction time", async () => {
    localStorage.setItem(ACCESS_TOKEN, "token-A");
    const { default: createPusher } = await import("./createPusher");
    createPusher();
    const PusherMock = (await import("pusher-js")).default as unknown as {
      mock: { results: { value: unknown }[] };
    };
    const instance = PusherMock.mock.results[0].value as Parameters<
      typeof currentAuthHeader
    >[0];

    expect(currentAuthHeader(instance)).toBe("Bearer token-A");

    // Simulate a token refresh completing after the Pusher client was constructed.
    localStorage.setItem(ACCESS_TOKEN, "token-B");

    expect(currentAuthHeader(instance)).toBe("Bearer token-B");
  });
});
