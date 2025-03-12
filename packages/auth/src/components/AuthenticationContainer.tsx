/* eslint-disable testing-library/no-debugging-utils */
// Note: We need snake case for tokens
import { ReactNode, createContext, useEffect, useMemo } from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";

import { defaultLogger, useLogger } from "@gc-digital-talent/logger";

import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ID_TOKEN,
  POST_LOGOUT_OVERRIDE_PATH_KEY,
  LogoutReason,
  LOGOUT_REASON_KEY,
  NAV_ROLE_KEY,
} from "../const";
import useLogoutChannel from "../hooks/useLogoutChannel";

export interface AuthenticationState {
  loggedIn: boolean;
  logout: (postLogoutUri?: string) => void;
  refreshTokenSet: () => Promise<void>;
}

const defaultAuthState = {
  loggedIn: false,
  logout: () => {
    /** do nothing */
  },
  refreshTokenSet: () => Promise.resolve(),
};

interface TokenSet {
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
}

export const AuthenticationContext =
  createContext<AuthenticationState>(defaultAuthState);

interface logoutAndRefreshPageParameters {
  // the "end session" URI of the auth provider
  logoutUri: string;
  // the logout landing page of our app (whitelisted)
  postLogoutRedirectUri: string;
  // if we want to go to another path else after logout
  postLogoutOverridePath?: string;
  // a function to broadcast the logout event to other tabs
  broadcastLogoutMessage?: () => void;
  // the reason for the logout
  logoutReason?: LogoutReason;
}

const logoutAndRefreshPage = ({
  logoutUri,
  postLogoutRedirectUri,
  postLogoutOverridePath,
  broadcastLogoutMessage,
  logoutReason,
}: logoutAndRefreshPageParameters): void => {
  defaultLogger.notice("Logging out and refreshing the page");
  // capture tokens before they are removed
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const idToken = localStorage.getItem(ID_TOKEN);

  // remove tokens from local storage
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(ID_TOKEN);
  localStorage.removeItem(NAV_ROLE_KEY);

  if (postLogoutOverridePath) {
    if (!postLogoutOverridePath.startsWith("/")) {
      defaultLogger.warning(
        `Tried to set an unsafe uri as postLogoutOverridePath: ${postLogoutOverridePath}`,
      );
    } else {
      // this gets pulled out out in the router before loading the logout landing page
      sessionStorage.setItem(
        POST_LOGOUT_OVERRIDE_PATH_KEY,
        postLogoutOverridePath,
      );
    }
  }

  if (logoutReason) {
    localStorage.setItem(LOGOUT_REASON_KEY, logoutReason);
  }

  let authSessionIsCurrentlyActive = false; // assume false unless we can prove it below

  if (accessToken) {
    const decodedAccessToken = jwtDecode<JwtPayload>(accessToken);
    if (decodedAccessToken.exp)
      authSessionIsCurrentlyActive = Date.now() < decodedAccessToken.exp * 1000; // JWT expiry date in seconds, not milliseconds
  }

  // Post a logout message to the broadcast channel
  // so they know to logout as well
  broadcastLogoutMessage?.();
  if (idToken && authSessionIsCurrentlyActive) {
    // SiC logout will error out unless there is actually an active session
    window.location.href = `${logoutUri}?post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}&id_token_hint=${idToken}`;
  } else {
    // at least a hard refresh to URI to restart react app
    window.location.href = postLogoutRedirectUri;
  }
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

interface TokenRefreshResponseBody {
  access_token: string;
  refresh_token: string;
  expires_in: string | null;
  id_token: string | null;
}

interface AuthenticationContainerProps {
  tokenRefreshPath: string;
  logoutUri: string;
  postLogoutRedirectUri: string;
  children?: ReactNode;
}

const AuthenticationContainer = ({
  tokenRefreshPath,
  logoutUri,
  postLogoutRedirectUri,
  children,
}: AuthenticationContainerProps) => {
  const logger = useLogger();
  const { broadcastLogoutMessage } = useLogoutChannel(() => {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      window.location.href = postLogoutRedirectUri;
    }
  });

  const newTokens = getTokensFromLocation();
  logger.debug(`new tokens from location: ${JSON.stringify(newTokens)}`);
  if (newTokens?.accessToken) {
    logger.debug("set new tokens from location in localStorage");
    localStorage.setItem(ACCESS_TOKEN, newTokens.accessToken);
    if (newTokens?.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN, newTokens.refreshToken);
    }
    if (newTokens?.idToken) {
      localStorage.setItem(ID_TOKEN, newTokens.idToken);
    }
    // also clear the last logout reason
    localStorage.removeItem(LOGOUT_REASON_KEY);
  }

  // Logout if the access token is removed in another way other than
  // the user logging out manually
  useEffect(() => {
    const logoutOnAccessTokenRemoved = (event: StorageEvent) => {
      if (event.key === ACCESS_TOKEN && event.newValue === null) {
        window.location.href = postLogoutRedirectUri;
      }
    };

    window.addEventListener("storage", logoutOnAccessTokenRemoved);

    return () =>
      window.removeEventListener("storage", logoutOnAccessTokenRemoved);
  });

  // We have saved it in local storage , then clear query parameters.
  useEffect(() => {
    if (newTokens?.accessToken) {
      logger.debug("Running newTokens clearQueryParams");
      clearQueryParams();
    }
  }, [newTokens?.accessToken, logger]); // Check for tokens individually so a new tokens object with identical contents doesn't trigger a re-render.

  // this is a memoized object so get the tokens from storage.
  const state = useMemo<AuthenticationState>(() => {
    return {
      loggedIn: !!localStorage.getItem(ACCESS_TOKEN),
      logout: localStorage.getItem(ACCESS_TOKEN)
        ? (postLogoutOverridePath) =>
            logoutAndRefreshPage({
              logoutUri,
              postLogoutRedirectUri,
              postLogoutOverridePath,
              broadcastLogoutMessage,
            })
        : () => {
            /* If not logged in, logout does nothing. */
          },
      refreshTokenSet: async () => {
        const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (storedRefreshToken === null) {
          logger.notice("No refresh token available.  Can't refresh.");
          return;
        }
        defaultLogger.notice("Attempting to refresh the auth token set");
        const response = await fetch(
          `${tokenRefreshPath}?refresh_token=${storedRefreshToken}`,
        );
        if (response.ok) {
          const responseBody: TokenRefreshResponseBody =
            (await response.json()) as TokenRefreshResponseBody;
          logger.debug(`Got refresh response: ${JSON.stringify(responseBody)}`);

          const refreshedTokens: TokenSet = {
            accessToken: responseBody.access_token,
            refreshToken: responseBody.refresh_token,
            idToken: responseBody.id_token,
          };

          if (refreshedTokens.accessToken) {
            localStorage.setItem(ACCESS_TOKEN, refreshedTokens.accessToken);
            if (refreshedTokens?.refreshToken) {
              localStorage.setItem(REFRESH_TOKEN, refreshedTokens.refreshToken);
            }
            if (refreshedTokens?.idToken) {
              localStorage.setItem(ID_TOKEN, refreshedTokens.idToken);
            }
          }
        } else {
          logger.notice("Failed to refresh auth state.");
          logoutAndRefreshPage({
            logoutUri,
            postLogoutRedirectUri,
            logoutReason: "session-expired",
          });
        }
      },
    };
  }, [
    logoutUri,
    postLogoutRedirectUri,
    broadcastLogoutMessage,
    tokenRefreshPath,
    logger,
  ]);

  return (
    <AuthenticationContext.Provider value={state}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContainer;
