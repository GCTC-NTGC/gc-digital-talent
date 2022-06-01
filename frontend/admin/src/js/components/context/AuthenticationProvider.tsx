import React from "react";

import { AuthenticationContainer } from "@common/components/Auth";

import { useApiRoutes } from "@common/hooks/useApiRoutes";
import { LOGOUT_URI, POST_LOGOUT_REDIRECT } from "../../adminConstants";
import { useAdminRoutes } from "../../adminRoutes";

const AuthenticationProvider: React.FC = ({ children }) => {
  const adminPaths = useAdminRoutes();
  const apiPaths = useApiRoutes();
  const homePath = adminPaths.home();
  const refreshTokenSetPath = apiPaths.refreshAccessToken();

  return (
    <AuthenticationContainer
      homePath={homePath}
      tokenRefreshPath={refreshTokenSetPath}
      logoutUri={LOGOUT_URI}
      logoutRedirectUri={POST_LOGOUT_REDIRECT}
    >
      {children}
    </AuthenticationContainer>
  );
};

export default AuthenticationProvider;
