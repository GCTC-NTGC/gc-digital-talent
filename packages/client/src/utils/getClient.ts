import {
  cacheExchange,
  Client,
  createClient,
  fetchExchange,
  mapExchange,
} from "urql";
import { IntlShape } from "react-intl";
import { authExchange } from "@urql/exchange-auth";

import {
  ACCESS_TOKEN,
  ID_TOKEN,
  LOGOUT_REASON_KEY,
  LogoutReason,
  NAV_ROLE_KEY,
  REFRESH_TOKEN,
} from "@gc-digital-talent/auth";
import { uniqueItems } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";
import { defaultLogger } from "@gc-digital-talent/logger";

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
import isTokenProbablyExpired from "./isTokenExpired";

interface TokenRefreshResponseBody {
  access_token: string;
  refresh_token: string;
  expires_in: string | null;
  id_token: string | null;
}

interface TokenSet {
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
}

// Very basic logout (entire function would need to move over in more complete migration)
function logout() {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(ID_TOKEN);
  localStorage.removeItem(NAV_ROLE_KEY);

  window.location.reload();
}

async function refreshTokenSet() {
  const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN);
  if (storedRefreshToken === null) {
    defaultLogger.notice("No refresh token available.  Can't refresh.");
    return;
  }
  defaultLogger.notice("Attempting to refresh the auth token set");
  const response = await fetch(`/refresh?refresh_token=${storedRefreshToken}`);
  if (response.ok) {
    const responseBody: TokenRefreshResponseBody =
      (await response.json()) as TokenRefreshResponseBody;
    defaultLogger.debug(
      `Got refresh response: ${JSON.stringify(responseBody)}`,
    );

    const refreshedTokens: TokenSet = {
      accessToken: responseBody.access_token,
      refreshToken: responseBody.refresh_token,
      idToken: responseBody.id_token,
    };

    if (refreshedTokens.accessToken) {
      localStorage.setItem(ACCESS_TOKEN, refreshedTokens.accessToken);
      if (refreshedTokens?.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN, refreshedTokens.refreshToken);
      }
      if (refreshedTokens?.idToken) {
        localStorage.setItem(ID_TOKEN, refreshedTokens.idToken);
      }
    }
  } else {
    defaultLogger.notice("Failed to refresh auth state.");
    logout();
  }
}

function getClient(intl: IntlShape): Client {
  return createClient({
    url: `${apiHost}${apiUri}`,
    requestPolicy: "cache-and-network",
    fetchOptions: { headers: { "Accept-Language": intl.locale } },
    exchanges: [
      cacheExchange,
      protectedEndpointExchange,
      mapExchange({
        onError(error, operation) {
          if (error.graphQLErrors || error.networkError) {
            defaultLogger.error(
              JSON.stringify({
                message: "ClientProvider onError",
                error,
                operation,
              }),
            );
          }

          const isDeleteUserError = containsUserDeletedError(error);
          if (isDeleteUserError) {
            defaultLogger.info(
              "detected a 'user deleted' error in the graphql client",
            );
            const logoutReason: LogoutReason = "user-deleted";
            localStorage.setItem(LOGOUT_REASON_KEY, logoutReason);
            localStorage.removeItem(NAV_ROLE_KEY);
            logout();
            return;
          }

          const isAuthError = containsAuthenticationError(error);
          if (isAuthError) {
            defaultLogger.info(
              "detected a authentication error in the graphql client",
            );
            const logoutReason: LogoutReason = "session-expired";
            localStorage.setItem(LOGOUT_REASON_KEY, logoutReason);
            localStorage.removeItem(NAV_ROLE_KEY);
            logout();
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
            defaultLogger.debug("No access token to add to operation");
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
                    e.extensions?.reason === "token_validation", // the auth provider says the token is invalid - maybe just a refresh is needed
                )
              : false;

            return didError;
          },
          async refreshAuth() {
            // If authState is not null, and getAuth is called again, then it means authentication failed for some reason.
            // let's try to use a refresh token to get new tokens

            const refreshToken = localStorage.getItem(REFRESH_TOKEN);
            if (refreshToken) {
              await refreshTokenSet();
            }
          },
        };
      }),
      specialErrorExchange({ intl }),
      fetchExchange,
    ],
  });
}

export default getClient;
