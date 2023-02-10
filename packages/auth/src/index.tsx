import AuthenticationProvider from "./components/AuthenticationProvider";
import AuthorizationProvider from "./components/AuthorizationProvider";

import useAuthentication from "./hooks/useAuthentication";
import useAuthorization from "./hooks/useAuthorization";
import apiRoutes, { useApiRoutes } from "./hooks/useApiRoutes";

export {
  AuthenticationProvider,
  AuthorizationProvider,
  useAuthentication,
  useAuthorization,
  useApiRoutes,
  apiRoutes,
};
