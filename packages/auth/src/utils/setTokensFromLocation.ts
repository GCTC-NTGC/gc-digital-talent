/* eslint-disable testing-library/no-debugging-utils */
import { appInsights } from "@gc-digital-talent/app-insights";
import { getLogger } from "@gc-digital-talent/logger";

import {
  ACCESS_TOKEN,
  ID_TOKEN,
  LOGOUT_REASON_KEY,
  REFRESH_TOKEN,
} from "../const";

export interface TokenSet {
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
}

function clearQueryParams() {
  window.history.pushState({}, "", `${window.location.pathname}`);
}

/**
 * Extract tokens from location search params
 */
export function setTokensFromLocation(): TokenSet | null {
  const logger = getLogger();
  const params = new URLSearchParams(window.location.search);
  const accessToken: string | null = params.get("access_token") ?? null;
  const refreshToken: string | null = params.get("refresh_token") ?? null;
  const idToken: string | null = params.get("id_token") ?? null;
  let newTokens: TokenSet | null = null;
  if (accessToken && params.get("token_type")?.toUpperCase() === "BEARER") {
    newTokens = {
      accessToken,
      refreshToken,
      idToken,
    };

    if (newTokens?.accessToken) {
      logger.debug("set new tokens from location in localStorage");
      localStorage.setItem(ACCESS_TOKEN, newTokens.accessToken);
      if (newTokens?.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN, newTokens.refreshToken);
      }
      if (newTokens?.idToken) {
        localStorage.setItem(ID_TOKEN, newTokens.idToken);
      }

      // Log the successful GCKey login event
      logger.debug("Logging GCKey login success event");
      const referrer = document.referrer || "none";
      if (appInsights) {
        const aiUserId = appInsights?.context?.user?.id || "unknown";
        appInsights.trackEvent?.(
          { name: "GCKey Login Success" },
          {
            aiUserId,
            pageUrl: window.location.href,
            timestamp: new Date().toISOString(),
            referrer,
            source: "AuthenticationContainer",
          },
        );
      }
      // also clear the last logout reason
      localStorage.removeItem(LOGOUT_REASON_KEY);
    }

    // We have saved it in local storage , then clear query parameters.
    clearQueryParams();
  }

  return newTokens;
}
