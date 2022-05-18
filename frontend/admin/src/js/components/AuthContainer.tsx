import React, { useEffect, useMemo, useState } from "react";
import {
  clearQueryParams,
  parseUrlQueryParameters,
  useLocation,
} from "@common/helpers/router";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { useAdminRoutes } from "../adminRoutes";
import { useApiRoutes } from "../apiRoutes";
import { LOGOUT_URI, POST_LOGOUT_REDIRECT } from "../adminConstants";

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

export const DefaultAuthState = {
  loggedIn: false,
  accessToken: null,
  refreshToken: null,
  idToken: null,
  logout: () => {
    /** do nothing */
  },
  refreshTokenSet: () => Promise.resolve(null),
}

export const AuthContext = React.createContext<AuthState>(DefaultAuthState);

const logoutAndRefreshPage = (homePath: string): void => {
  // capture tokens before they are removed
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const idToken = localStorage.getItem(ID_TOKEN);

  // remove tokens from local storage
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(ID_TOKEN);

  // check if we have everything we need to do an auth session end
  let authLogOutUri = null;
  if (accessToken && LOGOUT_URI && POST_LOGOUT_REDIRECT) {
    let tokenIsKnownToBeActive = false;
    const decodedAccessToken = jwtDecode<JwtPayload>(accessToken);
    if (decodedAccessToken.exp)
      tokenIsKnownToBeActive = Date.now() < decodedAccessToken.exp * 1000; // JWT expiry date in seconds, not milliseconds
    if (tokenIsKnownToBeActive) {
      // we probably have an active session with the auth provider so we need to sign out of it
      authLogOutUri = `${LOGOUT_URI}?post_logout_redirect_uri=${POST_LOGOUT_REDIRECT}`;
      if (idToken) authLogOutUri += `&id_token_hint=${idToken}`;
    }
  }

  // Navigate to auth log out to end the session or at least a hard refresh to home (to restart react app)
  window.location.href = authLogOutUri ?? homePath;
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
  const adminPaths = useAdminRoutes();
  const apiPaths = useApiRoutes();
  const homePath = adminPaths.home();
  const refreshTokenSetPath = apiPaths.refreshAccessToken();

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
