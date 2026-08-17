import type { Locales } from "@gc-digital-talent/i18n";
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

import type { LogoutReason } from "../const";
import {
  ACCESS_TOKEN,
  ID_TOKEN,
  LOGOUT_REASON_KEY,
  NAV_ROLE_KEY,
  POST_LOGOUT_OVERRIDE_PATH_KEY,
  REFRESH_TOKEN,
} from "../const";

interface LogoutAndRefreshPageParameters {
  // the "end session" URI of the auth provider
  logoutUri: string;
  // the logout landing page of this app (whitelisted)
  postLogoutRedirectUri: string;
  // option to force navigation to another path after logout
  postLogoutOverridePath?: string;
  // a function to broadcast the logout event to other tabs
  broadcastLogoutMessage?: () => void;
  // the reason for the logout
  logoutReason?: LogoutReason;
  // URL user came from and should be returned to after a full logout
  from?: string;
}

function logoutAndRefreshPage({
  logoutUri,
  postLogoutRedirectUri,
  postLogoutOverridePath,
  broadcastLogoutMessage,
  logoutReason,
  from,
}: LogoutAndRefreshPageParameters): void {
  defaultLogger.notice("Logging out and refreshing the page");
  // capture tokens before they are removed
  const idToken = localStorage.getItem(ID_TOKEN);

  // remove tokens from local storage
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(ID_TOKEN);
  localStorage.removeItem(NAV_ROLE_KEY);

  if (postLogoutOverridePath) {
    if (!postLogoutOverridePath.startsWith("/")) {
      defaultLogger.warning(
        `Attempted to set an unsafe URI as postLogoutOverridePath: ${postLogoutOverridePath}`,
      );
    } else {
      // this gets pulled out in the router before loading the logout landing page
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
      { name: "Auth Logout" },
      {
        aiUserId,
        pageUrl: window.location.href,
        timestamp: new Date().toISOString(),
        referrer: document.referrer || "none",
        source: "AuthenticationContainer",
        authStatus: "logout",
        logoutReason: logoutReason ?? "unknown",
      },
    );
  }

  // Post a logout message to the broadcast channel
  // so they know to logout as well
  broadcastLogoutMessage?.();

  // what is the the full end_session URL we are about to go to first?
  const endSessionUrl = new URL(logoutUri);

  // what URL are we redirecting back to after the session is ended?
  if (postLogoutRedirectUri) {
    const nextLocation = new URL(postLogoutRedirectUri);
    if (from) {
      nextLocation.searchParams.set("from", window.location.href);
    }
    endSessionUrl.searchParams.set(
      "post_logout_redirect_uri",
      nextLocation.toString(),
    );
  }

  if (idToken) {
    endSessionUrl.searchParams.set("id_token_hint", idToken);
  }

  window.location.href = endSessionUrl.toString();
}

export default logoutAndRefreshPage;
