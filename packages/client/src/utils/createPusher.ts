import type { SubscriptionForwarder } from "@urql/core";
import type { Channel } from "pusher-js";
import Pusher from "pusher-js";
import { print } from "graphql";

import { ACCESS_TOKEN } from "@gc-digital-talent/auth";

import { apiHost, apiUri, reverbAppKey } from "../constants";

interface LighthouseResponse {
  data: Record<string, unknown> | null | undefined;
  extensions?: {
    lighthouse_subscriptions?: {
      channel: string;
    };
  };
}

interface LighouseSubscriptionPayload {
  result: object;
  more: boolean;
}

type LighouseSubscriptionHandler = (
  payload: LighouseSubscriptionPayload,
) => void;

function createSubscription(
  createPusherClient: () => Pusher,
  subscriptionUrl: string,
): SubscriptionForwarder {
  let pusher: Pusher | undefined;
  let activeSubscriptions = 0;

  // Create a pusher client, increment subscriptions for tracking and then connect
  const acquirePusher = (): Pusher => {
    pusher ??= createPusherClient();
    activeSubscriptions += 1;
    if (activeSubscriptions === 1) {
      pusher.connect();
    }
    return pusher;
  };

  // Decrements the number of subscriptions and disconnect if it reaches 0
  const releasePusher = (): void => {
    activeSubscriptions -= 1;
    if (activeSubscriptions === 0) {
      pusher?.disconnect();
    }
  };

  return function (_request, operation) {
    return {
      subscribe: ({ next, error, complete }) => {
        const subscriptionId = String(operation.key);
        const activePusher = acquirePusher();

        let cancelled = false;
        let channelName: string | undefined;
        let channel: Channel | undefined;
        let subscriptionHandler: LighouseSubscriptionHandler | undefined;

        const cleanup = (): void => {
          if (cancelled) {
            return;
          }
          cancelled = true;

          if (channel && subscriptionHandler && channelName) {
            channel.unbind("lighthouse-subscription", subscriptionHandler);
            activePusher.unsubscribe(channelName);
          }

          releasePusher();
        };

        const handleError = (err: unknown): void => {
          error(err);
          cleanup();
        };

        const fetchBody = JSON.stringify({
          query: print(operation.query),
          variables: operation.variables,
        });

        let fetchOptions = operation.context.fetchOptions;
        if (typeof fetchOptions === "function") {
          fetchOptions = fetchOptions();
        } else fetchOptions ??= {};

        const headers = {
          ...fetchOptions.headers,
          "Content-Type": "application/json",
          "X-Subscription-ID": subscriptionId,
        };

        const mergedFetchOptions: RequestInit = {
          method: "POST",
          ...fetchOptions,
          body: fetchBody,
          headers,
        };

        const fetchFn = operation.context.fetch ?? fetch;

        fetchFn(subscriptionUrl, mergedFetchOptions)
          .then((res) => res.json())
          .then((res: LighthouseResponse) => {
            channelName = res?.extensions?.lighthouse_subscriptions?.channel;

            if (!channelName || cancelled) {
              cleanup();
              return;
            }

            try {
              channel = activePusher.subscribe(channelName);

              subscriptionHandler = (payload) => {
                if (payload.result) {
                  next(payload.result);
                }
                if (!payload.more) {
                  complete();
                }
              };

              channel.bind("lighthouse-subscription", subscriptionHandler);
              next(res);
            } catch (err) {
              handleError(err);
            }
          })
          .catch(handleError);

        return {
          unsubscribe: cleanup,
        };
      },
    };
  };
}

export const createPusherClient = () =>
  new Pusher(reverbAppKey, {
    cluster: "mt1",
    wsHost: window.location.hostname,
    wsPort: parseInt(window.location.port) || 80,
    forceTLS: window.location.protocol === "https:",
    enabledTransports: ["ws", "wss"],
    channelAuthorization: {
      transport: "ajax",
      endpoint: `${apiHost}/graphql/subscriptions/auth`,
      // Read from localStorage at auth-request time (not construction time),
      // so a refreshed access token is picked up on every reconnect instead
      // of freezing the token that existed when the app first mounted.
      headersProvider: () => ({
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        Accept: "application/json",
      }),
    },
  });

const createPusher = () =>
  createSubscription(createPusherClient, `${apiHost}${apiUri}`);

export default createPusher;
