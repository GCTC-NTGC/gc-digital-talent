import React, { useMemo } from "react";
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
  REFRESH_TOKEN,
  useAuthentication,
} from "@gc-digital-talent/auth";
import { useLogger } from "@gc-digital-talent/logger";
import { toast } from "@gc-digital-talent/toast";
import { uniqueItems } from "@gc-digital-talent/helpers";

import {
  buildValidationErrorMessageNode,
  containsAuthenticationError,
  extractErrorMessages,
  extractValidationMessageKeys,
} from "../../utils/errors";
import specialErrorExchange from "../../exchanges/specialErrorExchange";

const apiUri = process.env.API_URI ?? "http://localhost:8000/graphql";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
}

const willAuthError = (authState: AuthState | null) => {
  let tokenIsKnownToBeExpired = false;
  if (authState?.accessToken) {
    const decoded = jwtDecode<JwtPayload>(authState.accessToken);
    if (decoded.exp) tokenIsKnownToBeExpired = Date.now() > decoded.exp * 1000; // JWT expiry date in seconds, not milliseconds
  }

  if (tokenIsKnownToBeExpired) return true;

  return false;
};

const ClientProvider = ({
  client,
  children,
}: {
  client?: Client;
  children?: React.ReactNode;
}) => {
  const intl = useIntl();
  const authContext = useAuthentication();
  const logger = useLogger();
  // Create a mutable object to hold the auth state
  const authRef = React.useRef(authContext);
  // Keep the contents of that mutable object up to date
  React.useEffect(() => {
    authRef.current = authContext;
  }, [authContext]);

  const internalClient = useMemo(() => {
    return (
      client ??
      createClient({
        url: apiUri,
        requestPolicy: "cache-and-network",
        exchanges: [
          cacheExchange,
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

              const isAuthError = containsAuthenticationError(error);
              if (isAuthError) {
                authRef.current.logout("/logged-out");
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
          authExchange(async (utils) => {
            return {
              addAuthToOperation: (operation) => {
                const accessToken = localStorage.getItem(ACCESS_TOKEN);
                if (accessToken) {
                  return utils.appendHeaders(operation, {
                    Authorization: `Bearer ${accessToken}`,
                  });
                }
                return operation;
              },
              willAuthError() {
                const accessToken = localStorage.getItem(ACCESS_TOKEN);
                let tokenIsKnownToBeExpired = false;
                if (accessToken) {
                  const decoded = jwtDecode<JwtPayload>(accessToken);
                  if (decoded.exp)
                    tokenIsKnownToBeExpired = Date.now() > decoded.exp * 1000; // JWT expiry date in seconds, not milliseconds
                }

                if (tokenIsKnownToBeExpired) return true;

                return false;
              },
              didAuthError(error) {
                const didError =
                  error && error.response
                    ? error.response.status === 401 ||
                      error.graphQLErrors.some(
                        (e) => e.extensions?.category === "authentication",
                      )
                    : false;

                return didError;
              },
              async refreshAuth() {
                // If authState is not null, and getAuth is called again, then it means authentication failed for some reason.
                // let's try to use a refresh token to get new tokens
                let refreshedAuthState;
                const refreshToken = localStorage.getItem(REFRESH_TOKEN);
                if (refreshToken) {
                  refreshedAuthState = await authRef.current.refreshTokenSet();
                }

                if (!refreshedAuthState) {
                  authRef.current.logout(window.location.pathname);
                }
              },
            };
          }),
          specialErrorExchange({ intl }),
          fetchExchange,
        ],
      })
    );
  }, [client, intl, logger]);

  return <Provider value={internalClient}>{children}</Provider>;
};

export default ClientProvider;

// https://stackoverflow.com/questions/54116070/how-can-i-unit-test-non-exported-functions
export const exportedForTesting = {
  willAuthError,
  extractErrorMessages,
};
