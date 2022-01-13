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
  console.debug("->didAuthError");
  const result =
    error.response.status === 401 ||
    error.graphQLErrors.some(
      (e) => e.extensions?.category === "authentication",
    );
  console.debug("<-didAuthError", result);
  return result;
};

const willAuthError = ({ authState }: { authState: AuthState | null }) => {
  console.debug("->willAuthError", authState);
  let tokenIsKnownToBeExpired = false;
  if (authState?.expiry) {
    tokenIsKnownToBeExpired = Date.now() > authState.expiry;
  }
  console.debug("tokenIsKnownToBeExpired", tokenIsKnownToBeExpired);

  const result = !authState || tokenIsKnownToBeExpired;
  console.debug("<-willAuthError", result);
  if (result) return true;
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
      console.debug("->getAuth");
      // getAuth could be called for the first request or as a result of an error

      if (!existingAuthState) {
        console.debug(
          "No existing auth state.  Will try to get it out of storage.",
        );
        // no existing auth state so this is probably the first request
        if (accessToken) {
          console.debug("<-getAuth", "Found an access token", {
            accessToken,
            refreshToken,
            expiry,
          });
          return { accessToken, refreshToken, expiry };
        }
        console.debug("<-getAuth", "No token found");
        return null;
      }

      // there is an auth state so there was probably an error on the last request
      if (refreshToken) {
        console.debug(
          "There is an existing auth state so there was probably an error and we will try get a new one.",
        );
        const response = await fetch(
          `${refreshTokenPath()}?refresh_token=${refreshToken}`,
          {
            headers: {
              Authorization: `Bearer ${existingAuthState.accessToken}`,
            },
          },
        );
        if (response.ok) {
          const parsedResponse: {
            access_token: string;
            refresh_token: string;
            expires_in: string | null;
          } = await response.json();
          const newAuthState: AuthState = {
            accessToken: parsedResponse.access_token,
            refreshToken: parsedResponse.refresh_token,
            expiry: parsedResponse.expires_in
              ? Date.now() +
                Number.parseInt(parsedResponse.expires_in, 10) * 1000
              : null,
          };

          if (newAuthState.accessToken) {
            setAuthState(newAuthState);
            console.debug("<-getAuth", "Got new refresh tokens", newAuthState);
            return newAuthState;
          }
        }
      }

      console.debug("Giving up.  Logging out.");
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
