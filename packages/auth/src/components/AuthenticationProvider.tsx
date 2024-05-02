import React from "react";

import { getRuntimeVariableNotNull } from "@gc-digital-talent/env";
import { useLocale } from "@gc-digital-talent/i18n";

import { useApiRoutes } from "../hooks/useApiRoutes";
import AuthenticationContainer from "./AuthenticationContainer";

interface AuthenticationContainerProps {
  children?: React.ReactNode;
}

const AuthenticationProvider = ({ children }: AuthenticationContainerProps) => {
  const apiPaths = useApiRoutes();
  // eslint-disable-next-line no-restricted-syntax
  const { locale } = useLocale();
  const refreshTokenSetPath = apiPaths.refreshAccessToken();

  const logoutUri = getRuntimeVariableNotNull("OAUTH_LOGOUT_URI");
  const postLogoutRedirectUris = {
    en: getRuntimeVariableNotNull("OAUTH_POST_LOGOUT_REDIRECT_EN"),
    fr: getRuntimeVariableNotNull("OAUTH_POST_LOGOUT_REDIRECT_FR"),
  } as const;
  const postLogoutRedirectUri = postLogoutRedirectUris[locale];

  return (
    <AuthenticationContainer
      tokenRefreshPath={refreshTokenSetPath}
      logoutUri={logoutUri}
      postLogoutRedirectUri={postLogoutRedirectUri}
    >
      {children}
    </AuthenticationContainer>
  );
};

export default AuthenticationProvider;
