/* eslint-disable @typescript-eslint/no-deprecated */
import { AuthenticationContext } from "./components/AuthenticationContainer";
import AuthorizationContainer, {
  AuthorizationContext,
} from "./components/AuthorizationContainer";
import AuthenticationProvider from "./components/AuthenticationProvider";
import AuthorizationProvider from "./components/AuthorizationProvider";
import useAuthentication from "./hooks/useAuthentication";
import useAuthorization from "./hooks/useAuthorization";
import apiRoutes, { useApiRoutes } from "./hooks/useApiRoutes";
import {
  hasRequiredRoles,
  type HasRequiredRolesArgs,
  type RoleRequirement,
} from "./utils/hasRequiredRoles";
import hasRole from "./utils/hasRole";
import checkPermissions, {
  type PermissionRequirement,
} from "./utils/checkPermissions";
import useHasPermissions from "./hooks/useHasPermissions";
import { narrowTeamableType } from "./utils/narrowTeamableType";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ID_TOKEN,
  POST_LOGOUT_OVERRIDE_PATH_KEY,
  ROLE_NAME,
  LOGOUT_REASON_KEY,
  NAV_ROLE_KEY,
  COMMUNITY_ROLES,
  ASSESSMENT_MEMBER_ROLES,
  PROCESS_ACTIVITY_LOG_ROLES,
  DEPARTMENT_ROLES,
} from "./const";
import type { LogoutReason, RoleName } from "./const";
import getAuthenticationState from "./utils/authenticationState";
import type { AuthenticationState } from "./types";
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
  hasRequiredRoles,
  checkPermissions,
  useHasPermissions,
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
  ASSESSMENT_MEMBER_ROLES,
  PROCESS_ACTIVITY_LOG_ROLES,
  DEPARTMENT_ROLES,
};

export type {
  RoleName,
  LogoutReason,
  AuthenticationState,
  RoleRequirement,
  PermissionRequirement,
  HasRequiredRolesArgs,
};
