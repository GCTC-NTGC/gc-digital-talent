import { authExchange } from "@urql/exchange-auth";
import React, { useCallback, useContext, useMemo } from "react";
import { toast } from "react-toastify";
import {
  Client,
  CombinedError,
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  errorExchange,
  Provider,
  Operation,
  makeOperation,
} from "urql";
import { AuthContext } from "./AuthContainer";
import { refreshTokenPath } from "../adminRoutes";

const apiUri = process.env.API_URI ?? "http://localhost:8000/graphql";

interface AuthState {
  accessToken: string;
  refreshToken: string | null;
  expiry: number | null;
}

const addAuthToOperation = ({
  authState,
  operation,
}: {
  authState: AuthState | null;
  operation: Operation;
}): Operation => {
  if (!authState || !authState.accessToken) {
    return operation;
  }

  const fetchOptions =
    typeof operation.context.fetchOptions === "function"
      ? operation.context.fetchOptions()
      : operation.context.fetchOptions || {};

  return makeOperation(operation.kind, operation, {
    ...operation.context,
    fetchOptions: {
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        Authorization: `Bearer ${authState.accessToken}`,
      },
    },
  });
};

const didAuthError = ({ error }: { error: CombinedError }): boolean => {
  return (
    error.response.status === 401 ||
    error.graphQLErrors.some((e) => e.extensions?.category === "authentication")
  );
};

const willAuthError = ({ authState }: { authState: AuthState | null }) => {
  let tokenIsKnownToBeExpired = false;
  if (authState?.expiry) {
    tokenIsKnownToBeExpired = Date.now() > authState.expiry;
  }

  if (!authState || tokenIsKnownToBeExpired) return true;
  return false;
};

export const ClientProvider: React.FC<{ client?: Client }> = ({
  client,
  children,
}) => {
  const { accessToken, refreshToken, expiry, logout, setAuthState } =
    useContext(AuthContext);

  const getAuth = useCallback(
    async ({ authState: existingAuthState }): Promise<AuthState | null> => {
      // getAuth could be called for the first request or as the result of an error

      if (!existingAuthState) {
        // no existing auth state so this is probably just the first request
        if (accessToken) {
          return { accessToken, refreshToken, expiry };
        }
        return null;
      }

      // there is an existing auth state so there was probably an error on the last request
      if (refreshToken) {
        const response = await fetch(
          `${refreshTokenPath()}?refresh_token=${refreshToken}`,
        );
        if (response.ok) {
          const responseBody: {
            access_token: string;
            refresh_token: string;
            expires_in: string | null;
          } = await response.json();
          const newAuthState: AuthState = {
            accessToken: responseBody.access_token,
            refreshToken: responseBody.refresh_token,
            expiry: responseBody.expires_in
              ? Date.now() + Number.parseInt(responseBody.expires_in, 10) * 1000
              : null,
          };

          if (newAuthState.accessToken) {
            setAuthState(newAuthState);
            return newAuthState;
          }
        }
      }

      logout();
      return null;
    },
    [accessToken, refreshToken, expiry, logout, setAuthState],
  );

  const internalClient = useMemo(() => {
    return (
      client ??
      createClient({
        url: apiUri,
        exchanges: [
          errorExchange({
            onError: (error: CombinedError) => {
              toast.error(error.message);
            },
          }),
          dedupExchange,
          cacheExchange,
          authExchange({
            getAuth,
            addAuthToOperation,
            didAuthError,
            willAuthError,
          }),
          fetchExchange,
        ],
      })
    );
  }, [client, getAuth]);

  return <Provider value={internalClient}>{children}</Provider>;
};

export default ClientProvider;
