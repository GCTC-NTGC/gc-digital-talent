import { ReactNode, useEffect, useMemo, useRef } from "react";
import { authExchange } from "@urql/exchange-auth";
import { JwtPayload, jwtDecode } from "jwt-decode";
import {
  Client,
  createClient,
  cacheExchange,
  fetchExchange,
  Provider,
  mapExchange,
} from "urql";
import { useIntl } from "react-intl";

import {
  ACCESS_TOKEN,
  LOGOUT_REASON_KEY,
  NAV_ROLE_KEY,
  REFRESH_TOKEN,
  useAuthentication,
} from "@gc-digital-talent/auth";
import { useLogger } from "@gc-digital-talent/logger";
import { toast } from "@gc-digital-talent/toast";
import { uniqueItems } from "@gc-digital-talent/helpers";
import type { LogoutReason } from "@gc-digital-talent/auth";
import { getLocale } from "@gc-digital-talent/i18n";

import {
  buildValidationErrorMessageNode,
  containsAuthenticationError,
  extractErrorMessages,
  extractValidationMessageKeys,
  containsUserDeletedError,
} from "../../utils/errors";
import specialErrorExchange from "../../exchanges/specialErrorExchange";
import protectedEndpointExchange from "../../exchanges/protectedEndpointExchange";
import { allowableClockSkewSeconds, apiHost, apiUri } from "../../constants";

const isTokenProbablyExpired = (accessToken: string | null): boolean => {
  let tokenProbablyExpired = false;
  if (accessToken) {
    const decoded = jwtDecode<JwtPayload>(accessToken);
    if (decoded.exp) {
      const tokenExpiryDateSeconds = decoded.exp;
      const safeTokenExpiryDateSeconds =
        tokenExpiryDateSeconds - allowableClockSkewSeconds; // allow for the client's machine to be a bit off
      tokenProbablyExpired = Date.now() > safeTokenExpiryDateSeconds * 1000; // JWT expiry date in seconds to milliseconds
    }
  }

  return tokenProbablyExpired;
};

const ClientProvider = ({
  client,
  children,
}: {
  client?: Client;
  children?: ReactNode;
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const authContext = useAuthentication();
  const logger = useLogger();
  // Create a mutable object to hold the auth state
  const authRef = useRef(authContext);
  // Keep the contents of that mutable object up to date
  useEffect(() => {
    authRef.current = authContext;
  }, [authContext]);

  const internalClient = useMemo(() => {
    return (
      client ??
      createClient({
        url: `${apiHost}${apiUri}`,
        requestPolicy: "cache-and-network",
        fetchOptions: { headers: { "Accept-Language": locale } },
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
                logger.info(
                  "detected a 'user deleted' error in the graphql client",
                );
                const logoutReason: LogoutReason = "user-deleted";
                localStorage.setItem(LOGOUT_REASON_KEY, logoutReason);
                localStorage.removeItem(NAV_ROLE_KEY);
                authRef.current.logout();
                return;
              }

              const isAuthError = containsAuthenticationError(error);
              if (isAuthError) {
                logger.info(
                  "detected a authentication error in the graphql client",
                );
                const logoutReason: LogoutReason = "session-expired";
                localStorage.setItem(LOGOUT_REASON_KEY, logoutReason);
                localStorage.removeItem(NAV_ROLE_KEY);
                authRef.current.logout();
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
                  await authRef.current.refreshTokenSet();
                }
              },
            };
          }),
          specialErrorExchange({ intl }),
          fetchExchange,
        ],
      })
    );
  }, [client, intl, locale, logger]);

  return <Provider value={internalClient}>{children}</Provider>;
};

export default ClientProvider;

// https://stackoverflow.com/questions/54116070/how-can-i-unit-test-non-exported-functions
export const exportedForTesting = {
  isTokenProbablyExpired,
};
