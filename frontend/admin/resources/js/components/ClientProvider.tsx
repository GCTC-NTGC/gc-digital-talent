import { authExchange } from "@urql/exchange-auth";
import jwtDecode, { JwtPayload } from "jwt-decode";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
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

// generate nonce somewhere here?
// const nonce = ...

const apiUri = process.env.API_URI ?? "http://localhost:8000/graphql";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
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
  if (authState?.accessToken) {
    const decoded = jwtDecode<JwtPayload>(authState.accessToken);
    if (decoded.exp) tokenIsKnownToBeExpired = Date.now() > decoded.exp * 1000; // JWT expiry date in seconds, not milliseconds
  }

  if (tokenIsKnownToBeExpired) return true;

  return false;
};

export const ClientProvider: React.FC<{ client?: Client }> = ({
  client,
  children,
}) => {
  const authContext = useContext(AuthContext);
  // Create a mutable object to hold the auth state
  const authRef = useRef(authContext);
  // Keep the contents of that mutable object up to date
  useEffect(() => {
    authRef.current = authContext;
  }, [authContext]);

  const getAuth = useCallback(
    async ({ authState: existingAuthState }): Promise<AuthState | null> => {
      // getAuth could be called for the first request or as the result of an error

      // At runtime, get the current auth state
      const { accessToken, refreshToken, idToken, logout, refreshTokenSet } =
        authRef.current;

      if (!existingAuthState) {
        // no existing auth state so this is probably just the first request
        if (accessToken) {
          return { accessToken, refreshToken, idToken };
        }
        return null;
      }

      // If authState is not null, and getAuth is called again, then it means authentication failed for some reason.
      // let's try to use a refresh token to get new tokens
      if (refreshToken) {
        const refreshedAuthState = refreshTokenSet();
        return refreshedAuthState;
      }

      logout();
      return null;
    },
    // We need a single instance of this function so the urql client can maintain its state.
    // Otherwise, it loses count of the errors and enters a refresh loop.
    [],
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

// https://stackoverflow.com/questions/54116070/how-can-i-unit-test-non-exported-functions
export const exportedForTesting = {
  willAuthError,
};
