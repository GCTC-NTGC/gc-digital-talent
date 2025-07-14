import { SubscriptionForwarder } from "@urql/core";
import Pusher, { Channel } from "pusher-js";
import { print } from "graphql";

type ForwardCallback = (...args: unknown[]) => void;

interface LighthouseResponse {
  data: unknown;
  extensions?: {
    lighthouse_subscriptions?: {
      channel: string;
    };
  };
}

function createPusherSubscription(
  pusher: Pusher,
  subscriptionUrl: string,
): SubscriptionForwarder {
  return function (_request, operation) {
    return {
      subscribe: ({
        next,
        error,
        complete,
      }: {
        next: ForwardCallback;
        error: ForwardCallback;
        complete: ForwardCallback;
      }) => {
        const subscriptionId = String(operation.key);

        let pusherChannelName: string | null = null;
        let pusherChannel: Channel | null = null;
        let boundHandler:
          | ((payload: { result: object; more: boolean }) => void)
          | null = null;

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
          .then(async (fetchResult) => {
            // Parse and emit the initial fetch result
            try {
              const jsonResult =
                (await fetchResult.json()) as LighthouseResponse;
              pusherChannelName =
                jsonResult?.extensions?.lighthouse_subscriptions?.channel ??
                fetchResult.headers.get("X-Subscription-ID") ??
                subscriptionId;

              pusherChannel = pusher.subscribe(pusherChannelName);

              boundHandler = (payload: { result: object; more: boolean }) => {
                console.log("update", payload);
                if (payload.result) {
                  next(payload.result);
                }
                if (!payload.more) {
                  complete();
                }
              };

              pusherChannel.bind("update", boundHandler);
              next(jsonResult);
            } catch (parseError) {
              error(parseError);
            }
          })
          .catch(error);

        return {
          unsubscribe: () => {
            if (pusherChannel && boundHandler) {
              pusherChannel.unbind("update", boundHandler);
              pusher.unsubscribe(pusherChannelName!);
            }
          },
        };
      },
    };
  };
}

export default createPusherSubscription;
