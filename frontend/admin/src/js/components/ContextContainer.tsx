import React from "react";

import { AuthContainer, AuthorizationContainer } from "@common/components/Auth";
import ClientProvider from "@common/components/ClientProvider";
import LanguageRedirectContainer from "@common/components/LanguageRedirectContainer";

import { getMessages } from "./IntlContainer";
import { LOGOUT_URI, POST_LOGOUT_REDIRECT } from "../adminConstants";
import { useAdminRoutes } from "../adminRoutes";
import { useApiRoutes } from "../apiRoutes";
import { useGetMeQuery } from "../api/generated";

const AuthorizationProvider: React.FC = ({ children }) => {
  const [result] = useGetMeQuery();
  const { data } = result;

  console.log(data);

  return (
    <AuthorizationContainer userRoles={data?.me?.roles}>
      {children}
    </AuthorizationContainer>
  );
};

const AuthContainers: React.FC = ({ children }) => {
  const adminPaths = useAdminRoutes();
  const apiPaths = useApiRoutes();
  const homePath = adminPaths.home();
  const refreshTokenSetPath = apiPaths.refreshAccessToken();

  return (
    <AuthContainer
      homePath={homePath}
      tokenRefreshPath={refreshTokenSetPath}
      logoutUri={LOGOUT_URI}
      logoutRedirectUri={POST_LOGOUT_REDIRECT}
    >
      <ClientProvider>
        <AuthorizationProvider>{children}</AuthorizationProvider>
      </ClientProvider>
    </AuthContainer>
  );
};

const ContextContainer: React.FC = ({ children }) => {
  return (
    <LanguageRedirectContainer getMessages={getMessages}>
      <AuthContainers>{children}</AuthContainers>
    </LanguageRedirectContainer>
  );
};

export default ContextContainer;
