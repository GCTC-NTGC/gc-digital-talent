import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { parse } from "graphql";
import { createRequest, makeOperation } from "@urql/core";
import type { SubscriptionForwarder } from "@urql/core";
import { makeFetchBody } from "@urql/core/internal";

import { ACCESS_TOKEN } from "@gc-digital-talent/auth";

import createPusher, { createPusherClient } from "./createPusher";

interface MockPusher {
  capturedOptions: {
    channelAuthorization: { headersProvider: () => Record<string, string> };
  };
  connect: Mock;
  disconnect: Mock;
  subscribe: Mock;
  unsubscribe: Mock;
}

const pushers: MockPusher[] = [];

vi.mock("pusher-js", () => {
  return {
    default: vi.fn().mockImplementation(function MockPusher(
      this: MockPusher,
      _key: string,
      options: MockPusher["capturedOptions"],
    ) {
      this.capturedOptions = options;
      this.connect = vi.fn();
      this.disconnect = vi.fn();
      this.subscribe = vi.fn(() => ({ bind: vi.fn(), unbind: vi.fn() }));
      this.unsubscribe = vi.fn();
      pushers.push(this);
    }),
  };
});

vi.mock("../constants", () => ({
  apiHost: "http://localhost:8000",
  apiUri: "/graphql",
  reverbAppKey: "gcdt",
}));

function currentAuthHeader(pusherInstance: {
  capturedOptions: {
    channelAuthorization: { headersProvider: () => Record<string, string> };
  };
}) {
  return pusherInstance.capturedOptions.channelAuthorization.headersProvider()
    .Authorization;
}

const request = createRequest(parse("subscription Test { ping }"), {});

function startSubscription(
  forwardSubscription: SubscriptionForwarder,
  fetchMock: typeof fetch,
) {
  const operation = makeOperation("subscription", request, {
    url: "http://localhost:8000/graphql",
    requestPolicy: "network-only",
    fetch: fetchMock,
  });

  return forwardSubscription(makeFetchBody(request), operation).subscribe({
    next: vi.fn(),
    error: vi.fn(),
    complete: vi.fn(),
  });
}

const neverResponds: typeof fetch = () =>
  new Promise<Response>(() => undefined);

beforeEach(() => {
  localStorage.clear();
  pushers.length = 0;
});

describe("createPusher auth header freshness", () => {
  it("uses the CURRENT localStorage access token, not the one captured at construction time", () => {
    localStorage.setItem(ACCESS_TOKEN, "token-A");
    createPusherClient();

    expect(currentAuthHeader(pushers[0])).toBe("Bearer token-A");

    // Simulate a token refresh completing after the Pusher client was constructed.
    localStorage.setItem(ACCESS_TOKEN, "token-B");

    expect(currentAuthHeader(pushers[0])).toBe("Bearer token-B");
  });
});

describe("createPusher connection lifetime", () => {
  it("builds no Pusher client when nothing subscribes", () => {
    createPusher();

    expect(pushers).toHaveLength(0);
  });

  it("connects once for the first subscription", () => {
    const forwardSubscription = createPusher();

    startSubscription(forwardSubscription, neverResponds);
    startSubscription(forwardSubscription, neverResponds);

    expect(pushers).toHaveLength(1);
    expect(pushers[0].connect).toHaveBeenCalledTimes(1);
  });

  it("disconnects when the last subscription ends", () => {
    const forwardSubscription = createPusher();
    const first = startSubscription(forwardSubscription, neverResponds);
    const second = startSubscription(forwardSubscription, neverResponds);

    first.unsubscribe();

    expect(pushers[0].disconnect).not.toHaveBeenCalled();

    second.unsubscribe();

    expect(pushers[0].disconnect).toHaveBeenCalledTimes(1);
  });

  it("connects the same client again for a later subscription", () => {
    const forwardSubscription = createPusher();

    startSubscription(forwardSubscription, neverResponds).unsubscribe();
    startSubscription(forwardSubscription, neverResponds);

    expect(pushers).toHaveLength(1);
    expect(pushers[0].connect).toHaveBeenCalledTimes(2);
  });

  it("subscribes to no channel when unsubscribed before the response arrives", async () => {
    let sendResponse: (response: Response) => void = () => undefined;
    const respondsLater: typeof fetch = () =>
      new Promise<Response>((resolve) => {
        sendResponse = resolve;
      });

    startSubscription(createPusher(), respondsLater).unsubscribe();
    sendResponse(
      Response.json({
        data: null,
        // eslint-disable-next-line camelcase -- Lighthouse controls this name, we cannot change it
        extensions: { lighthouse_subscriptions: { channel: "private-test" } },
      }),
    );
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(pushers[0].subscribe).not.toHaveBeenCalled();
    expect(pushers[0].disconnect).toHaveBeenCalledTimes(1);
  });

  it("disconnects when the subscription request rejects", async () => {
    const rejects: typeof fetch = () => Promise.reject(new Error("offline"));

    startSubscription(createPusher(), rejects);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(pushers[0].disconnect).toHaveBeenCalledTimes(1);
  });
});
