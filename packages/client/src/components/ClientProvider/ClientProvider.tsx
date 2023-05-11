import React, { useEffect, useMemo, useRef } from "react";
import { authExchange } from "@urql/exchange-auth";
import jwtDecode, { JwtPayload } from "jwt-decode";
import {
  Client,
  CombinedError,
  createClient,
  cacheExchange,
  fetchExchange,
  errorExchange,
  Provider,
  Operation,
  AnyVariables,
} from "urql";
import { useIntl } from "react-intl";

import { useAuthentication } from "@gc-digital-talent/auth";
import { useLogger } from "@gc-digital-talent/logger";
import { toast } from "@gc-digital-talent/toast";

import {
  buildRateLimitErrorMessageNode,
  buildValidationErrorMessageNode,
  buildAuthorizationErrorMessageNode,
  extractRateLimitErrorMessages,
  extractValidationErrorMessages,
  extractAuthorizationErrorMessages,
} from "../../utils/errors";

// generate nonce somewhere here?
// const nonce = ...

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
  const authRef = useRef(authContext);
  // Keep the contents of that mutable object up to date
  useEffect(() => {
    authRef.current = authContext;
  }, [authContext]);

  const { accessToken, refreshToken, idToken, logout, refreshTokenSet } =
    authRef.current;

  const refreshAuth = React.useCallback(async () => {
    /**
     * Logout the user and return null AuthState
     *
     * @returns null
     */
    const logoutNullState = () => {
      const currentLocation = window.location.pathname; // Can't use react-router hooks because we may not be inside the Router context.
      logout(currentLocation); // After logging out, try to return to the page the user was on.
    };

    // If authState is not null, and getAuth is called again, then it means authentication failed for some reason.
    // let's try to use a refresh token to get new tokens
    if (refreshToken) {
      const refreshedAuthState = await refreshTokenSet();
      if (refreshedAuthState) {
        return;
      }

      logoutNullState();
    }

    logoutNullState();
  }, [refreshToken, logout, refreshTokenSet]);

  const internalClient = useMemo(() => {
    return (
      client ??
      createClient({
        url: apiUri,
        requestPolicy: "cache-and-network",
        exchanges: [
          errorExchange({
            onError: (
              error: CombinedError,
              operation: Operation<unknown, AnyVariables>,
            ) => {
              const validationErrorMessages =
                extractValidationErrorMessages(error);
              const validationErrorMessageNode =
                buildValidationErrorMessageNode(validationErrorMessages, intl);
              if (validationErrorMessageNode)
                toast.error(validationErrorMessageNode);

              const rateLimitErrorMessages =
                extractRateLimitErrorMessages(error);
              const rateLimitErrorMessageNode = buildRateLimitErrorMessageNode(
                rateLimitErrorMessages,
                intl,
              );
              if (rateLimitErrorMessageNode)
                toast.error(rateLimitErrorMessageNode, {
                  toastId: "rate-limit", // limits toasts for rate limit to one.
                });

              const authorizationErrorMessages =
                extractAuthorizationErrorMessages(error);
              const authorizationErrorMessageNode =
                buildAuthorizationErrorMessageNode(
                  authorizationErrorMessages,
                  intl,
                );
              if (authorizationErrorMessageNode)
                toast.error(authorizationErrorMessageNode);

              if (error.graphQLErrors || error.networkError) {
                logger.error(
                  JSON.stringify({
                    message: "ClientProvider onError",
                    error,
                    operation,
                  }),
                );
              }
            },
          }),
          cacheExchange,
          authExchange(async (utils) => {
            return {
              addAuthToOperation(operation) {
                if (accessToken) {
                  return utils.appendHeaders(operation, {
                    Authorization: `Bearer ${accessToken}`,
                  });
                }
                return operation;
              },
              willAuthError: () =>
                willAuthError({
                  accessToken,
                  refreshToken,
                  idToken,
                }),
              didAuthError(error) {
                return error && error.response
                  ? error.response.status === 401 ||
                      error.graphQLErrors.some(
                        (e) => e.extensions?.category === "authentication",
                      )
                  : false;
              },
              refreshAuth,
            };
          }),
          fetchExchange,
        ],
      })
    );
  }, [accessToken, client, idToken, intl, logger, refreshAuth, refreshToken]);

  return <Provider value={internalClient}>{children}</Provider>;
};

export default ClientProvider;

// https://stackoverflow.com/questions/54116070/how-can-i-unit-test-non-exported-functions
export const exportedForTesting = {
  extractValidationErrorMessages,
  willAuthError,
};
