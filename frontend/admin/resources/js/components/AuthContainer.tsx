import React, { useEffect, useMemo, useState } from "react";
import {
  clearQueryParams,
  parseUrlQueryParameters,
  useLocation,
} from "@common/helpers/router";
import { useAdminRoutes } from "../adminRoutes";

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";
const ID_TOKEN = "id_token";

interface AuthState {
  loggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  logout: () => void;
  refreshTokenSet: () => Promise<TokenSet | null>;
}

interface TokenSet {
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
}

export const AuthContext = React.createContext<AuthState>({
  loggedIn: false,
  accessToken: null,
  refreshToken: null,
  idToken: null,
  logout: () => {
    /** do nothing */
  },
  refreshTokenSet: () => Promise.resolve(null),
});

const logoutAndRefreshPage = (homePath: string): void => {
  // To log out, remove tokens from local storage and do a hard refresh to clear anything cached by react.
  // TODO: Is there anything else we should do, in terms of notifying user?
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(ID_TOKEN);
  window.location.href = homePath;
};

const refreshTokenSet = async (
  refreshPath: string,
  refreshToken: string,
  setTokens: (tokens: TokenSet) => void,
): Promise<TokenSet | null> => {
  const response = await fetch(`${refreshPath}?refresh_token=${refreshToken}`);
  if (response.ok) {
    const responseBody: {
      access_token: string;
      refresh_token: string;
      expires_in: string | null;
      id_token: string | null;
    } = await response.json();

    const newTokens: TokenSet = {
      accessToken: responseBody.access_token,
      refreshToken: responseBody.refresh_token,
      idToken: responseBody.id_token,
    };

    if (newTokens.accessToken) {
      setTokens(newTokens);
      localStorage.setItem(ACCESS_TOKEN, newTokens.accessToken);
      if (newTokens?.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN, newTokens.refreshToken);
      }
      if (newTokens?.idToken) {
        localStorage.setItem(ID_TOKEN, newTokens.idToken);
      }
      return newTokens;
    }
  }
  return null;
};

function getTokensFromLocation(
  location: ReturnType<typeof useLocation>,
): TokenSet | null {
  const queryParams = parseUrlQueryParameters(location);
  const accessToken: string | null = queryParams.access_token ?? null;
  const refreshToken: string | null = queryParams.refresh_token ?? null;
  const idToken: string | null = queryParams.id_token ?? null;
  if (accessToken && queryParams.token_type?.toUpperCase() === "BEARER") {
    return {
      accessToken,
      refreshToken,
      idToken,
    };
  }
  return null;
}

export const AuthContainer: React.FC = ({ children }) => {
  const [existingTokens, setTokens] = useState({
    accessToken: localStorage.getItem(ACCESS_TOKEN),
    refreshToken: localStorage.getItem(REFRESH_TOKEN),
    idToken: localStorage.getItem(ID_TOKEN),
  });

  const location = useLocation();
  const newTokens = getTokensFromLocation(location);
  const paths = useAdminRoutes();
  const homePath = paths.home();
  const refreshTokenSetPath = paths.refreshAccessToken();

  // If newTokens is not null, then we have a new access token in the url. Save it in local storage and in state hook, then clear query parameters.
  useEffect(() => {
    if (newTokens?.accessToken) {
      setTokens({
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
        idToken: newTokens.idToken,
      });
      localStorage.setItem(ACCESS_TOKEN, newTokens.accessToken);
      if (newTokens?.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN, newTokens.refreshToken);
      }
      if (newTokens?.idToken) {
        localStorage.setItem(ID_TOKEN, newTokens.idToken);
      }
      clearQueryParams();
    }
  }, [newTokens?.accessToken, newTokens?.refreshToken, newTokens?.idToken]); // Check for tokens individually so a new tokens object with identical contents doesn't trigger a re-render.

  // If tokens were just found in the url, then get them from newTokens instead of state hook, which will update asynchronously.
  const tokens = newTokens ?? existingTokens;
  const state = useMemo<AuthState>(() => {
    return {
      accessToken: tokens.accessToken,
      idToken: tokens.idToken,
      refreshToken: tokens.refreshToken,
      loggedIn: !!tokens.accessToken,
      logout: tokens.accessToken
        ? () => logoutAndRefreshPage(homePath)
        : () => {
            /* If not logged in, logout does nothing. */
          },
      refreshTokenSet: () =>
        tokens.refreshToken
          ? refreshTokenSet(refreshTokenSetPath, tokens.refreshToken, setTokens)
          : Promise.resolve(null),
    };
  }, [
    tokens.accessToken,
    tokens.idToken,
    tokens.refreshToken,
    homePath,
    refreshTokenSetPath,
  ]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export default AuthContainer;
