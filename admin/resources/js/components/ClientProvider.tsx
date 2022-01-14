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

const apiUri = process.env.API_URI ?? "http://localhost:8000/graphql";

interface AuthState {
  accessToken: string | null;
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
  const { accessToken, refreshToken, expiry, logout, refresh } =
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
        const refreshedAuthState = refresh();
        return refreshedAuthState;
      }

      logout();
      return null;
    },
    [accessToken, refreshToken, expiry, logout, refresh],
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
