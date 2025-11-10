/* eslint-disable testing-library/no-debugging-utils */
import { getLogger } from "@gc-digital-talent/logger";
import { Locales } from "@gc-digital-talent/i18n";

import { AuthenticationState } from "../types";
import { ACCESS_TOKEN, ID_TOKEN, REFRESH_TOKEN } from "../const";
import logoutAndRefreshPage, { getLogoutVars } from "./logout";
import { TokenSet } from "./getTokensFromLocation";
import getTokenRefreshPath from "./getTokenRefreshPath";
import { getLogoutChannel } from "./logoutChannel";

interface TokenRefreshResponseBody {
  access_token: string;
  refresh_token: string;
  expires_in: string | null;
  id_token: string | null;
}

interface GetAuthenticationStateArgs {
  locale: Locales;
}

function getAuthenticationState({
  locale,
}: GetAuthenticationStateArgs): AuthenticationState {
  const logger = getLogger();
  const tokenRefreshPath = getTokenRefreshPath();
  const { logoutUri, postLogoutRedirectUri } = getLogoutVars(locale);
  const broadcastLogoutMessage = getLogoutChannel(() => {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      window.location.href = postLogoutRedirectUri;
    }
  });

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
      logger.notice("Attempting to refresh the auth token set");
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
          /**
           * Failure prevents redirect when possible or,
           * returns user to the page they were on to continue
           *
           * Allows router to handle errors and either load page
           * or restart auth flow if necessary.
           */
          preventRedirect: true,
          from: window.location.href,
        });
      }
    },
  };
}

export default getAuthenticationState;
