import { ReactNode, createContext, useEffect, useMemo } from "react";

import { Locales } from "@gc-digital-talent/i18n";

import { ACCESS_TOKEN } from "../const";
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

interface AuthenticationContainerProps {
  locale: Locales;
  children?: ReactNode;
}

const AuthenticationContainer = ({
  locale,
  children,
}: AuthenticationContainerProps) => {
  const { postLogoutRedirectUri } = getLogoutVars(locale);

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
