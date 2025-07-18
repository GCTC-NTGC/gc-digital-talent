import { SubscriptionForwarder } from "@urql/core";
import Pusher, { Channel } from "pusher-js";
import { print } from "graphql";

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

function createPusherSubscription(
  pusher: Pusher,
  subscriptionUrl: string,
): SubscriptionForwarder {
  return function (_request, operation) {
    return {
      subscribe: ({ next, error, complete }) => {
        const subscriptionId = String(operation.key);

        let channelName: string | undefined;
        let channel: Channel | undefined;
        let subscriptionHandler: LighouseSubscriptionHandler | undefined;

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

            if (!channelName) {
              return;
            }

            try {
              channel = pusher.subscribe(channelName);

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
              error(err);
            }
          })
          .catch(error);

        return {
          unsubscribe: () => {
            if (channel && subscriptionHandler && channelName) {
              channel.unbind("lighthouse-subscription", subscriptionHandler);
              pusher.unsubscribe(channelName);
            }
          },
        };
      },
    };
  };
}

export default createPusherSubscription;
