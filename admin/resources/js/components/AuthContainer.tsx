import React, { useEffect, useMemo, useState } from "react";
import {
  clearQueryParams,
  parseUrlQueryParameters,
  useLocation,
} from "@common/helpers/router";
import { homePath } from "../adminRoutes";

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";

interface AuthState {
  loggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthState>({
  loggedIn: false,
  accessToken: null,
  refreshToken: null,
  logout: () => {
    /** do nothing */
  },
});

const logoutAndRefresh = (): void => {
  // To log out, remove tokens from local storage and do a hard refresh to clear anything cached by react.
  // TODO: Is there anything else we should do, in terms of notifying user?
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  window.location.href = homePath();
};

function getTokensFromLocation(
  location: ReturnType<typeof useLocation>,
): { accessToken: string; refreshToken: string | null } | null {
  const queryParams = parseUrlQueryParameters(location);
  const accessToken: string | null = queryParams.access_token ?? null;
  const refreshToken: string | null = queryParams.refresh_token ?? null;
  if (accessToken && queryParams.token_type?.toUpperCase() === "BEARER") {
    return {
      accessToken,
      refreshToken,
    };
  }
  return null;
}

export const AuthContainer: React.FC = ({ children }) => {
  const [stateTokens, setTokens] = useState({
    accessToken: localStorage.getItem(ACCESS_TOKEN),
    refreshToken: localStorage.getItem(REFRESH_TOKEN),
  });

  const location = useLocation();
  const newTokens = getTokensFromLocation(location);

  // If newTokens is not null, then we have a new access token in the url. Save it in local storage and in state hook, then clear query parameters.
  useEffect(() => {
    if (newTokens?.accessToken) {
      setTokens({
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      });
      localStorage.setItem(ACCESS_TOKEN, newTokens.accessToken);
      if (newTokens?.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN, newTokens.refreshToken);
      }
      clearQueryParams();
    }
  }, [newTokens?.accessToken, newTokens?.refreshToken]); // Check for tokens individually so a new tokens object with identical contents doesn't trigger a re-render.

  // If tokens were just found in the url, then get them from newTokens instead of state hook, which will update asynchronously.
  const tokens = newTokens ?? stateTokens;
  const state = useMemo<AuthState>(() => {
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      loggedIn: !!tokens.accessToken,
      logout: tokens.accessToken
        ? logoutAndRefresh
        : () => {
            /* If not logged in, logout does nothing. */
          },
    };
  }, [tokens.accessToken, tokens.refreshToken]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export default AuthContainer;
