import React from "react";

import { AuthenticationContainer } from "../Auth";
import { useApiRoutes } from "../../hooks/useApiRoutes";
import { getRuntimeVariable } from "../../helpers/runtimeVariable";

export interface AuthenticationProviderProps {
  homePath: string;
}

const AuthenticationProvider: React.FC<AuthenticationProviderProps> = ({
  homePath,
  children,
}) => {
  const apiPaths = useApiRoutes();
  const refreshTokenSetPath = apiPaths.refreshAccessToken();

  const logoutUri = getRuntimeVariable("OAUTH_LOGOUT_URI");
  const postLogoutRedirect = getRuntimeVariable("OAUTH_POST_LOGOUT_REDIRECT");

  return (
    <AuthenticationContainer
      homePath={homePath}
      tokenRefreshPath={refreshTokenSetPath}
      logoutUri={logoutUri}
      logoutRedirectUri={postLogoutRedirect}
    >
      {children}
    </AuthenticationContainer>
  );
};

export default AuthenticationProvider;
