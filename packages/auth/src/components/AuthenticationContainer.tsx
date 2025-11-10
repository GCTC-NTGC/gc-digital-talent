/* eslint-disable testing-library/no-debugging-utils */
// Note: We need snake case for tokens
import { ReactNode, createContext, useEffect, useMemo } from "react";

import { getLogger } from "@gc-digital-talent/logger";
import { Locales } from "@gc-digital-talent/i18n";

import { ACCESS_TOKEN } from "../const";
import { getTokensFromLocation } from "../utils/getTokensFromLocation";
import { AuthenticationState } from "../types";
import getAuthenticationState from "../utils/authenticationState";
import { getLogoutVars } from "../utils/logout";

const defaultAuthState = {
  loggedIn: false,
  logout: () => {
    /** do nothing */
  },
  refreshTokenSet: () => Promise.resolve(),
};

export const AuthenticationContext =
  createContext<AuthenticationState>(defaultAuthState);

function clearQueryParams() {
  window.history.pushState({}, "", `${window.location.pathname}`);
}

interface AuthenticationContainerProps {
  locale: Locales;
  children?: ReactNode;
}

const AuthenticationContainer = ({
  locale,
  children,
}: AuthenticationContainerProps) => {
  const logger = getLogger();
  const { postLogoutRedirectUri } = getLogoutVars(locale);

  const newTokens = getTokensFromLocation();
  logger.debug(`new tokens from location: ${JSON.stringify(newTokens)}`);

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
    return getAuthenticationState({ locale });
  }, [locale]);

  return (
    <AuthenticationContext.Provider value={state}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContainer;
