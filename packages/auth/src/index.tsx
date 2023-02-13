import RequireAuth from "./components/RequireAuth";
import AuthenticationProvider from "./components/AuthenticationProvider";
import AuthorizationProvider from "./components/AuthorizationProvider";

import useAuthentication from "./hooks/useAuthentication";
import useAuthorization from "./hooks/useAuthorization";
import apiRoutes, { useApiRoutes } from "./hooks/useApiRoutes";

import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ID_TOKEN,
  POST_LOGOUT_URI_KEY,
} from "./const";

export {
  RequireAuth,
  AuthenticationProvider,
  AuthorizationProvider,
  useAuthentication,
  useAuthorization,
  useApiRoutes,
  apiRoutes,
};

export { ACCESS_TOKEN, REFRESH_TOKEN, ID_TOKEN, POST_LOGOUT_URI_KEY };
