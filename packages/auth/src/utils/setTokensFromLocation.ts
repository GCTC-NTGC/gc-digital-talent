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

/**
 * Extract tokens from location search params
 *
 * @returns boolean to notify caller that tokens were found and stored
 */
export function setTokensFromLocation(url: URL): boolean {
  const logger = getLogger();
  const accessToken = url.searchParams.get("access_token");
  let newTokens: TokenSet | null = null;

  if (
    accessToken &&
    url.searchParams.get("token_type")?.toUpperCase() === "BEARER"
  ) {
    const refreshToken = url.searchParams.get("refresh_token");
    const idToken = url.searchParams.get("id_token");

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

    // saved in local storage
    return true;
  }

  // Nothing to save
  return false;
}
