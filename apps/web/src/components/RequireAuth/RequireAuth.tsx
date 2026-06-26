import { useLocation, useNavigate, useSearchParams } from "react-router";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { getLogger } from "@gc-digital-talent/logger";
import { Loading } from "@gc-digital-talent/ui";
import { notEmpty, UnauthorizedError } from "@gc-digital-talent/helpers";
import type { RoleName, RoleRequirement } from "@gc-digital-talent/auth";
import {
  hasRequiredRoles,
  useAuthentication,
  useAuthorization,
} from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";

import useNavContext from "../NavContext/useNavContext";

interface RequireAuthPropsForRoleNames {
  children: ReactNode;
  roles: RoleName[];
  rolesRequirements?: never;
  loginPath?: string;
  strict?: never;
}

interface RequireAuthPropsForRoleRequirements {
  children: ReactNode;
  roles?: never;
  rolesRequirements: RoleRequirement[];
  loginPath?: string;
  strict?: boolean;
}

const RequireAuth = (
  props: RequireAuthPropsForRoleNames | RequireAuthPropsForRoleRequirements,
) => {
  const location = useLocation();
  const logger = getLogger();
  const { loggedIn } = useAuthentication();
  const { roleAssignments, isLoaded } = useAuthorization();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paths = useRoutes();
  const loginRedirectPath = props.loginPath ?? paths.login();
  const navContext = useNavContext();

  const userRoleNames = roleAssignments
    ?.map((a) => a.role?.name)
    .filter(notEmpty);

  let isAuthorized: boolean;
  let authorizedRoleNames: RoleName[];

  // branch 1: role names provided
  if ("roles" in props) {
    authorizedRoleNames = props.roles ?? [];
    isAuthorized =
      isLoaded &&
      authorizedRoleNames?.some((authorizedRoleName) =>
        userRoleNames?.includes(authorizedRoleName),
      );
  } // branch 2: role requirements provided
  else if ("rolesRequirements" in props) {
    const authorizedRoleRequirements = props.rolesRequirements ?? [];
    authorizedRoleNames = authorizedRoleRequirements.map((r) => r.name);
    isAuthorized =
      isLoaded &&
      hasRequiredRoles({
        toCheck: authorizedRoleRequirements,
        userRoles: roleAssignments,
        strict: props.strict,
      });
  }
  // unexpected branch
  else {
    authorizedRoleNames = [];
    isAuthorized = false;
  }

  useEffect(() => {
    if (!loggedIn) {
      const loginSearchParams = new URLSearchParams();
      loginSearchParams.append("from", location.pathname);
      const personality = searchParams.get("personality");
      if (personality) loginSearchParams.append("personality", personality);
      void navigate(
        {
          pathname: loginRedirectPath,
          search: loginSearchParams.toString(),
        },
        {
          replace: true,
        },
      );
    }
  }, [location.pathname, loggedIn, loginRedirectPath, navigate, searchParams]);

  useEffect(() => {
    if (isAuthorized) {
      navContext.onAuthorizedRolesChanged(authorizedRoleNames);
    }
  }, [authorizedRoleNames, isAuthorized, navContext]);

  // Prevent showing children while login redirect happens
  if (!loggedIn) {
    return <Loading />;
  }

  if (loggedIn && !isAuthorized) {
    logger.notice(
      JSON.stringify({
        message: "Signed in but not authorized",
        pathname: location.pathname,
      }),
    );
    throw new UnauthorizedError();
  }

  return <>{props.children}</>;
};

export default RequireAuth;
