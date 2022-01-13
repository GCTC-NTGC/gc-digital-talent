import React, { useEffect, useMemo, useState } from "react";
import {
  clearQueryParams,
  parseUrlQueryParameters,
  useLocation,
} from "@common/helpers/router";
import { homePath } from "../adminRoutes";

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";
const TOKEN_EXPIRY = "token_expiry";

interface AuthState {
  loggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  expiry: number | null;
  logout: () => void;
  setAuthState: (tokens: {
    accessToken: string | null;
    refreshToken: string | null;
    expiry: number | null;
  }) => void;
}

export const AuthContext = React.createContext<AuthState>({
  loggedIn: false,
  accessToken: null,
  refreshToken: null,
  expiry: null,
  logout: () => {
    /** do nothing */
  },
  setAuthState: () => {
    /* do nothing */
  },
});

const logoutAndRefresh = (): void => {
  // To log out, remove tokens from local storage and do a hard refresh to clear anything cached by react.
  // TODO: Is there anything else we should do, in terms of notifying user?
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(TOKEN_EXPIRY);
  window.location.href = homePath();
};

function getAuthFromLocation(location: ReturnType<typeof useLocation>): {
  accessToken: string;
  refreshToken: string | null;
  expiry: number | null;
} | null {
  const queryParams = parseUrlQueryParameters(location);
  const accessToken: string | null = queryParams.access_token ?? null;
  const refreshToken: string | null = queryParams.refresh_token ?? null;
  const expiry: number | null = queryParams.expires_in
    ? Date.now() + Number.parseInt(queryParams.expires_in, 10) * 1000
    : null;
  if (accessToken && queryParams.token_type?.toUpperCase() === "BEARER") {
    return {
      accessToken,
      refreshToken,
      expiry,
    };
  }
  return null;
}

export const AuthContainer: React.FC = ({ children }) => {
  const [existingAuthState, setAuthState] = useState<{
    accessToken: string | null;
    refreshToken: string | null;
    expiry: number | null;
  }>({
    accessToken: localStorage.getItem(ACCESS_TOKEN),
    refreshToken: localStorage.getItem(REFRESH_TOKEN),
    expiry: Number.parseInt(localStorage.getItem(TOKEN_EXPIRY) ?? "", 10),
  });

  const location = useLocation();
  const newAuthState = getAuthFromLocation(location);

  // If newAuthState is not null, then we have a new access token in the url. Save it in local storage and in state hook, then clear query parameters.
  useEffect(() => {
    if (newAuthState?.accessToken) {
      setAuthState({
        accessToken: newAuthState.accessToken,
        refreshToken: newAuthState.refreshToken,
        expiry: newAuthState.expiry,
      });
      localStorage.setItem(ACCESS_TOKEN, newAuthState.accessToken);
      if (newAuthState?.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN, newAuthState.refreshToken);
      }
      if (newAuthState?.expiry) {
        localStorage.setItem(TOKEN_EXPIRY, newAuthState.expiry.toString());
      }
      clearQueryParams();
    }
  }, [
    newAuthState?.accessToken,
    newAuthState?.refreshToken,
    newAuthState?.expiry,
  ]); // Check for tokens individually so a new tokens object with identical contents doesn't trigger a re-render.

  // If tokens were just found in the url, then get them from newTokens instead of state hook, which will update asynchronously.
  const authState = newAuthState ?? existingAuthState;
  const state = useMemo<AuthState>(() => {
    return {
      accessToken: authState.accessToken,
      refreshToken: authState.refreshToken,
      loggedIn: !!authState.accessToken,
      expiry: authState.expiry,
      logout: authState.accessToken
        ? logoutAndRefresh
        : () => {
            /* If not logged in, logout does nothing. */
          },
      setAuthState,
    };
  }, [authState.accessToken, authState.refreshToken, authState.expiry]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export default AuthContainer;
