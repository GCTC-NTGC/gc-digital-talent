import { AuthenticationContext } from "./components/AuthenticationContainer";
import AuthorizationContainer, {
  AuthorizationContext,
} from "./components/AuthorizationContainer";
import AuthenticationProvider from "./components/AuthenticationProvider";
import AuthorizationProvider from "./components/AuthorizationProvider";
import useAuthentication from "./hooks/useAuthentication";
import useAuthorization from "./hooks/useAuthorization";
import apiRoutes, { useApiRoutes } from "./hooks/useApiRoutes";
import hasRole from "./utils/hasRole";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ID_TOKEN,
  POST_LOGOUT_OVERRIDE_PATH_KEY,
  ROLE_NAME,
  RoleName,
  LOGOUT_REASON_KEY,
  NAV_ROLE_KEY,
} from "./const";
import type { LogoutReason } from "./const";

export {
  AuthenticationProvider,
  AuthorizationProvider,
  AuthenticationContext,
  AuthorizationContext,
  AuthorizationContainer,
  useAuthentication,
  useAuthorization,
  useApiRoutes,
  apiRoutes,
  hasRole,
};

export {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ID_TOKEN,
  POST_LOGOUT_OVERRIDE_PATH_KEY,
  LOGOUT_REASON_KEY,
  ROLE_NAME,
  NAV_ROLE_KEY,
};

export type { RoleName, LogoutReason };
