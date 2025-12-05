import { jwtDecode, JwtPayload } from "jwt-decode";

import { Locales } from "@gc-digital-talent/i18n";
import { getRuntimeVariableNotNull } from "@gc-digital-talent/env";
import { defaultLogger } from "@gc-digital-talent/logger";
import { appInsights } from "@gc-digital-talent/app-insights";

export function getLogoutVars(locale: Locales) {
  const logoutUri = getRuntimeVariableNotNull("OAUTH_LOGOUT_URI");
  const postLogoutRedirectUris = {
    en: getRuntimeVariableNotNull("OAUTH_POST_LOGOUT_REDIRECT_EN"),
    fr: getRuntimeVariableNotNull("OAUTH_POST_LOGOUT_REDIRECT_FR"),
  } as const;
  const postLogoutRedirectUri = postLogoutRedirectUris[locale];

  return {
    logoutUri,
    postLogoutRedirectUri,
  };
}

import {
  ACCESS_TOKEN,
  ID_TOKEN,
  LOGOUT_REASON_KEY,
  LogoutReason,
  NAV_ROLE_KEY,
  POST_LOGOUT_OVERRIDE_PATH_KEY,
  REFRESH_TOKEN,
} from "../const";

interface LogoutAndRefreshPageParameters {
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
  // Should we prevent the redirect when completing?
  preventRedirect?: boolean;
  // URL user came from and should be returned to after a full logout
  from?: string;
}

function logoutAndRefreshPage({
  logoutUri,
  postLogoutRedirectUri,
  postLogoutOverridePath,
  broadcastLogoutMessage,
  logoutReason,
  preventRedirect = false,
  from,
}: LogoutAndRefreshPageParameters): void {
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

  // track the logout event in application insights
  if (appInsights) {
    const aiUserId = appInsights?.context?.user?.id || "unknown";
    appInsights.trackEvent?.(
      { name: "GCKey Logout" },
      {
        aiUserId,
        pageUrl: window.location.href,
        timestamp: new Date().toISOString(),
        referrer: document.referrer || "none",
        source: "AuthenticationContainer",
        gcKeyStatus: "logout",
        logoutReason: logoutReason ?? "unknown",
      },
    );
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

  let nextLocation = postLogoutRedirectUri;
  if (from) {
    const searchParams = new URLSearchParams();
    searchParams.append("from", window.location.href);
    nextLocation = `${nextLocation}?${searchParams.toString()}`;
  }

  if (idToken && authSessionIsCurrentlyActive) {
    // SiC logout will error out unless there is actually an active session
    window.location.href = `${logoutUri}?post_logout_redirect_uri=${encodeURIComponent(nextLocation)}&id_token_hint=${idToken}`;
  } else if (!preventRedirect) {
    // at least a hard refresh to URI to restart react app
    window.location.href = nextLocation;
  } else {
    window.location.reload();
  }
}

export default logoutAndRefreshPage;
