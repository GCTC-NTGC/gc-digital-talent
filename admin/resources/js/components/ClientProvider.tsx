import { authExchange } from "@urql/exchange-auth";
import React, { useContext, useEffect, useMemo } from "react";
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
import {
  parseUrlQueryParameters,
  redirect,
  useLocation,
} from "../helpers/router";
import { homePath } from "../helpers/routes";
import { ErrorContext } from "./ErrorContainer";

const apiUri = process.env.API_URI ?? "http://localhost:8000/graphql";

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";

interface AuthState {
  token: string;
  refreshToken: string;
}

const logout = (): void => {
  // To log out, remove tokens from local storage and do a hard refresh to clear anything cached by urql or react.
  // TODO: Is there anything else we should do, in terms of notifying user?
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  window.location.href = homePath();
};

const getAuth = async ({
  authState,
}: {
  authState: AuthState | null;
}): Promise<AuthState | null> => {
  if (!authState) {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (token && refreshToken) {
      return { token, refreshToken };
    }
    return null;
  }
  // If authState is not null, and getAuth is called again, then it means authentication failed for some reason.
  // TODO: This is where we could try using the refresh token, instead of logging out.
  logout();
  return null;
};

const addAuthToOperation = ({
  authState,
  operation,
}: {
  authState: AuthState | null;
  operation: Operation;
}): Operation => {
  if (!authState || !authState.token) {
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
        Authorization: `Bearer ${authState.token}`,
      },
    },
  });
};

const didAuthError = ({ error }: { error: CombinedError }): boolean => {
  //   console.log(error); // TODO: what does a 401 status code error look like?
  return (
    error.response.status === 401 ||
    error.graphQLErrors.some((e) => e.extensions?.code === "FORBIDDEN")
  );
};

export const ClientProvider: React.FC<{ client?: Client }> = ({
  client,
  children,
}) => {
  const location = useLocation();
  useEffect(() => {
    const queryParams = parseUrlQueryParameters(location);
    const accessToken = queryParams.access_token;
    if (accessToken && queryParams.token_type === "Bearer") {
      // If url query parameters contain an access token, save it in local storage and then redirect to remove the url query params.
      localStorage.setItem(ACCESS_TOKEN, accessToken);
      if (queryParams.refresh_token) {
        localStorage.setItem(REFRESH_TOKEN, queryParams.refresh_token);
      }
      redirect({
        ...location,
        search: "",
      });
    }
  }, [location]);

  const { dispatch } = useContext(ErrorContext);

  const internalClient = useMemo(() => {
    return (
      client ??
      createClient({
        url: apiUri,
        exchanges: [
          errorExchange({
            onError: (error: CombinedError) => {
              dispatch({
                type: "push",
                payload: error.message,
              });
            },
          }),
          dedupExchange,
          cacheExchange,
          authExchange({
            getAuth,
            addAuthToOperation,
            didAuthError,
          }),
          fetchExchange,
        ],
      })
    );
  }, [client, dispatch]);

  return <Provider value={internalClient}>{children}</Provider>;
};

export default ClientProvider;
