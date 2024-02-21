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
  const { locale } = useLocale();
  const refreshTokenSetPath = apiPaths.refreshAccessToken();

  const logoutUri = getRuntimeVariableNotNull("OAUTH_LOGOUT_URI");
  const redirectPaths = {
    en: getRuntimeVariableNotNull("OAUTH_POST_LOGOUT_REDIRECT_EN"),
    fr: getRuntimeVariableNotNull("OAUTH_POST_LOGOUT_REDIRECT_FR"),
  } as const;
  const postLogoutRedirect = redirectPaths[locale];

  return (
    <AuthenticationContainer
      tokenRefreshPath={refreshTokenSetPath}
      logoutUri={logoutUri}
      logoutRedirectUri={postLogoutRedirect}
    >
      {children}
    </AuthenticationContainer>
  );
};

export default AuthenticationProvider;
