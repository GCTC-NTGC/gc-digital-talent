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
import { narrowTeamableType } from "./utils/narrowTeamableType";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ID_TOKEN,
  POST_LOGOUT_OVERRIDE_PATH_KEY,
  ROLE_NAME,
  RoleName,
  LOGOUT_REASON_KEY,
  NAV_ROLE_KEY,
  COMMUNITY_ROLES,
} from "./const";
import type { LogoutReason } from "./const";
import getAuthenticationState from "./utils/authenticationState";
import { AuthenticationState } from "./types";
import { setTokensFromLocation } from "./utils/setTokensFromLocation";

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
  narrowTeamableType,
  getAuthenticationState,
  setTokensFromLocation,
};

export {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ID_TOKEN,
  POST_LOGOUT_OVERRIDE_PATH_KEY,
  LOGOUT_REASON_KEY,
  ROLE_NAME,
  NAV_ROLE_KEY,
  COMMUNITY_ROLES,
};

export type { RoleName, LogoutReason, AuthenticationState };
