import type { IntlShape } from "react-intl";
import type { Client } from "urql";
import {
  cacheExchange,
  createClient,
  fetchExchange,
  mapExchange,
  subscriptionExchange,
} from "urql";
import { authExchange } from "@urql/exchange-auth";

import { getLocale } from "@gc-digital-talent/i18n";
import { getLogger } from "@gc-digital-talent/logger";
import { toast } from "@gc-digital-talent/toast";
import type {
  LogoutReason,
  AuthenticationState,
} from "@gc-digital-talent/auth";
import {
  ACCESS_TOKEN,
  getAuthenticationState,
  LOGOUT_REASON_KEY,
  NAV_ROLE_KEY,
  REFRESH_TOKEN,
} from "@gc-digital-talent/auth";
import { uniqueItems } from "@gc-digital-talent/helpers";

import protectedEndpointExchange from "../exchanges/protectedEndpointExchange";
import { apiHost, apiUri } from "../constants";
import {
  buildValidationErrorMessageNode,
  containsAuthenticationError,
  containsUserDeletedError,
  extractErrorMessages,
  extractValidationMessageKeys,
} from "./errors";
import specialErrorExchange from "../exchanges/specialErrorExchange";
import { isTokenProbablyExpired } from "./isTokenProbablyExpired";
import createPusher from "./createPusher";

interface GetClientArgs {
  intl: IntlShape;
  authState?: AuthenticationState;
  // Control if we connect to the websocket server
  withSubscriptions?: boolean;
}

export function getClient({
  intl,
  authState,
  withSubscriptions = false,
}: GetClientArgs): Client {
  const locale = getLocale(intl);
  const logger = getLogger();
  const auth = authState ?? getAuthenticationState({ locale });
  const forwardSubscription = withSubscriptions ? createPusher() : null;

  return createClient({
    url: `${apiHost}${apiUri}`,
    requestPolicy: "cache-and-network",
    fetchOptions: { headers: { "Accept-Language": locale } },
    preferGetMethod: false,
    exchanges: [
      cacheExchange,
      protectedEndpointExchange,
      mapExchange({
        onError(error, operation) {
          if (error.graphQLErrors || error.networkError) {
            logger.error(
              JSON.stringify({
                message: "ClientProvider onError",
                error,
                operation,
              }),
            );
          }

          const isDeleteUserError = containsUserDeletedError(error);
          if (isDeleteUserError) {
            logger.info("detected 'user deleted' error in graphql client");
            const logoutReason: LogoutReason = "user-deleted";
            localStorage.setItem(LOGOUT_REASON_KEY, logoutReason);
            localStorage.removeItem(NAV_ROLE_KEY);
            auth.logout();
            return;
          }

          const isAuthError = containsAuthenticationError(error);
          if (isAuthError) {
            logger.info("detected authentication error in graphql client");
            const logoutReason: LogoutReason = "session-expired";
            localStorage.setItem(LOGOUT_REASON_KEY, logoutReason);
            localStorage.removeItem(NAV_ROLE_KEY);
            auth.logout();
            return;
          }

          let errorMessages = extractErrorMessages(error);

          const validationMessageKeys = extractValidationMessageKeys(error);
          if (validationMessageKeys.length > 0) {
            errorMessages = validationMessageKeys;
          }

          const errorMessageNode = buildValidationErrorMessageNode(
            uniqueItems(errorMessages),
            intl,
          );
          if (errorMessageNode) toast.error(errorMessageNode);
        },
      }),
      // NOTE: Needed to colour the function
      // eslint-disable-next-line @typescript-eslint/require-await
      authExchange(async (utils) => {
        return {
          addAuthToOperation: (operation) => {
            const accessToken = localStorage.getItem(ACCESS_TOKEN);
            if (accessToken) {
              return utils.appendHeaders(operation, {
                Authorization: `Bearer ${accessToken}`,
              });
            }
            // eslint-disable-next-line testing-library/no-debugging-utils
            logger.debug("No access token to add to operation");
            return operation;
          },
          willAuthError() {
            const accessToken = localStorage.getItem(ACCESS_TOKEN);
            return isTokenProbablyExpired(accessToken);
          },
          didAuthError(error) {
            const res = error.response as Response | null;
            const didError = res
              ? res.status === 401 ||
                error.graphQLErrors.some(
                  (e) =>
                    e.extensions?.category === "authentication" ||
                    e.extensions?.reason === "token_validation",
                )
              : false;

            return didError;
          },
          async refreshAuth() {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);
            if (refreshToken) {
              await auth.refreshTokenSet();
            }
          },
        };
      }),
      ...(withSubscriptions && forwardSubscription
        ? [subscriptionExchange({ forwardSubscription })]
        : []),
      specialErrorExchange({ intl }),
      fetchExchange,
    ],
  });
}
