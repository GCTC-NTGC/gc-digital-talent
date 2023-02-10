import React from "react";

import { getRuntimeVariableNotNull } from "@gc-digital-talent/runtime";

import AuthenticationContainer from "./AuthenticationContainer";

import { useApiRoutes } from "../../hooks/useApiRoutes";

interface AuthenticationContainerProps {
  children?: React.ReactNode;
}

const AuthenticationProvider = ({ children }: AuthenticationContainerProps) => {
  const apiPaths = useApiRoutes();
  const refreshTokenSetPath = apiPaths.refreshAccessToken();

  const logoutUri = getRuntimeVariableNotNull("OAUTH_LOGOUT_URI");
  const postLogoutRedirect = getRuntimeVariableNotNull(
    "OAUTH_POST_LOGOUT_REDIRECT",
  );

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
