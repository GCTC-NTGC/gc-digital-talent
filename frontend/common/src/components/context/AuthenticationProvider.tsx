import React from "react";

import { AuthenticationContainer } from "../Auth";
import { useApiRoutes } from "../../hooks/useApiRoutes";
import { getRuntimeVariableNotNull } from "../../helpers/runtimeVariable";

const AuthenticationProvider: React.FC = ({ children }) => {
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
