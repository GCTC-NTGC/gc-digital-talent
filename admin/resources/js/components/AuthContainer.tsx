import React, { useEffect, useMemo, useState } from "react";
import {
  parseUrlQueryParameters,
  redirect,
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

export var AuthContainer: React.FC = function ({ children }) {
  const [tokens, setTokens] = useState({
    accessToken: localStorage.getItem(ACCESS_TOKEN),
    refreshToken: localStorage.getItem(REFRESH_TOKEN),
  });

  const location = useLocation();
  console.log("Auth container, location:", location);
  useEffect(() => {
    const queryParams = parseUrlQueryParameters(location);
    const accessToken = queryParams.access_token;
    const refreshToken = queryParams.refresh_token;
    if (accessToken && queryParams.token_type === "Bearer") {
      // If url query parameters contain an access token, save it in local storage and in state hook.
      localStorage.setItem(ACCESS_TOKEN, accessToken);
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN, refreshToken);
      }
      setTokens({ accessToken, refreshToken });
      // Then, redirect to the same url but without all the query parameters.
      redirect({
        ...location,
        search: "",
      });
    }
  }, [location]);

  const state = useMemo<AuthState>(() => {
    console.log("In AuthContainer; new tokens:", tokens);
    return {
      ...tokens,
      loggedIn: !!tokens.accessToken,
      logout: tokens.accessToken
        ? logoutAndRefresh
        : () => {
            /* If not logged in, logout does nothing. */
          },
    };
  }, [tokens]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export default AuthContainer;
