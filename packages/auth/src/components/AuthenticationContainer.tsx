// Note: We need snake case for tokens
/* eslint-disable camelcase */
import React, { useEffect, useMemo, useState } from "react";
import jwtDecode, { JwtPayload } from "jwt-decode";

import { defaultLogger } from "@gc-digital-talent/logger";

import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ID_TOKEN,
  POST_LOGOUT_URI_KEY,
} from "../const";

export interface AuthenticationState {
  loggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  logout: (postLogoutUri?: string) => void;
  refreshTokenSet: () => Promise<TokenSet | null>;
}

export const defaultAuthState = {
  loggedIn: false,
  accessToken: null,
  refreshToken: null,
  idToken: null,
  logout: () => {
    /** do nothing */
  },
  refreshTokenSet: () => Promise.resolve(null),
};

interface TokenSet {
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
}

export const AuthenticationContext =
  React.createContext<AuthenticationState>(defaultAuthState);

const logoutAndRefreshPage = (
  logoutUri: string,
  logoutRedirectUri: string,
  postLogoutUri?: string,
): void => {
  defaultLogger.notice("Logging out and refreshing the page");
  // capture tokens before they are removed
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const idToken = localStorage.getItem(ID_TOKEN);

  // remove tokens from local storage
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(ID_TOKEN);

  if (postLogoutUri) {
    if (!postLogoutUri.startsWith("/")) {
      defaultLogger.warning(
        `Tried to set an unsafe uri as postLogoutUri: ${postLogoutUri}`,
      );
    } else {
      sessionStorage.setItem(POST_LOGOUT_URI_KEY, postLogoutUri);
    }
  }

  let authSessionIsCurrentlyActive = false; // assume false unless we can prove it below

  if (accessToken) {
    const decodedAccessToken = jwtDecode<JwtPayload>(accessToken);
    if (decodedAccessToken.exp)
      authSessionIsCurrentlyActive = Date.now() < decodedAccessToken.exp * 1000; // JWT expiry date in seconds, not milliseconds
  }

  if (idToken && authSessionIsCurrentlyActive) {
    // SiC logout will error out unless there is actually an active session
    window.location.href = `${logoutUri}?post_logout_redirect_uri=${logoutRedirectUri}&id_token_hint=${idToken}`;
  } else {
    // at least a hard refresh to URI to restart react app
    window.location.href = logoutRedirectUri;
  }
};

const refreshTokenSet = async (
  refreshPath: string,
  // refreshToken: string,
  setTokens: (tokens: TokenSet) => void,
): Promise<TokenSet | null> => {
  // Local storage should be most up to date, especially if a refresh happened in a different tab.
  // This is a bit hacky.  It would be better to have the refreshToken passed in as parameter like before.
  // The provider state could be kept in sync with something like storage events (https://dev.to/cassiolacerda/how-to-syncing-react-state-across-multiple-tabs-with-usestate-hook-4bdm)
  defaultLogger.notice("Attempting to refresh the auth token set");
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);

  if (refreshToken === null) {
    return null;
  }

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

function getTokensFromLocation(): TokenSet | null {
  const params = new URLSearchParams(window.location.search);
  const accessToken: string | null = params.get("access_token") ?? null;
  const refreshToken: string | null = params.get("refresh_token") ?? null;
  const idToken: string | null = params.get("id_token") ?? null;
  if (accessToken && params.get("token_type")?.toUpperCase() === "BEARER") {
    return {
      accessToken,
      refreshToken,
      idToken,
    };
  }
  return null;
}

function clearQueryParams() {
  window.history.pushState({}, "", `${window.location.pathname}`);
}

interface AuthenticationContainerProps {
  tokenRefreshPath: string;
  logoutUri: string;
  logoutRedirectUri: string;
  children?: React.ReactNode;
}

const AuthenticationContainer: React.FC<AuthenticationContainerProps> = ({
  tokenRefreshPath,
  logoutUri,
  logoutRedirectUri,
  children,
}) => {
  const [existingTokens, setTokens] = useState({
    accessToken: localStorage.getItem(ACCESS_TOKEN),
    refreshToken: localStorage.getItem(REFRESH_TOKEN),
    idToken: localStorage.getItem(ID_TOKEN),
  });

  const newTokens = getTokensFromLocation();

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
  const state = useMemo<AuthenticationState>(() => {
    return {
      accessToken: tokens.accessToken,
      idToken: tokens.idToken,
      refreshToken: tokens.refreshToken,
      loggedIn: !!tokens.accessToken,
      logout: tokens.accessToken
        ? (postLogoutUri) =>
            logoutAndRefreshPage(logoutUri, logoutRedirectUri, postLogoutUri)
        : () => {
            /* If not logged in, logout does nothing. */
          },
      refreshTokenSet: () =>
        tokens.refreshToken
          ? refreshTokenSet(
              tokenRefreshPath,
              /* tokens.refreshToken, */ setTokens,
            )
          : Promise.resolve(null),
    };
  }, [
    tokens.accessToken,
    tokens.idToken,
    tokens.refreshToken,
    logoutUri,
    logoutRedirectUri,
    tokenRefreshPath,
  ]);

  return (
    <AuthenticationContext.Provider value={state}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContainer;
