import { createContext, ReactNode, useEffect, useMemo } from "react";

import {
  RoleName,
  NAV_ROLE_KEY,
  useAuthentication,
  useAuthorization,
  ROLE_NAME,
} from "@gc-digital-talent/auth";
import { assertUnreachable, notEmpty } from "@gc-digital-talent/helpers";
import { useLocalStorage } from "@gc-digital-talent/storage";

// this array is ordered by privilege to allow proper sorting
const NAV_ROLES_BY_PRIVILEGE = [
  null,
  "applicant",
  "manager",
  "community",
  "admin",
] as const;

export type NavRole = (typeof NAV_ROLES_BY_PRIVILEGE)[number];

export const isNavRole = (x: unknown): x is NavRole => {
  switch (x) {
    case "applicant":
    case "manager":
    case "community":
    case "admin":
      return true;
    default:
      return false;
  }
};
// x && typeof x === 'string' ? NAV_ROLES_BY_PRIVILEGE.includes(x) :

export interface NavContextState {
  navRole: NavRole;
  onAuthorizedRolesChanged: (roles: RoleName[]) => void;
}

export const NavContext = createContext<NavContextState>({
  navRole: null,
  onAuthorizedRolesChanged: () => {
    // no-op
  },
});

export function convertRoleToNavRole(role: RoleName): NavRole {
  switch (role) {
    case "guest":
    case "base_user":
      return null;
    case "applicant":
      return "applicant";
    case "manager":
      return "manager";
    case "pool_operator":
    case "request_responder":
    case "community_manager":
    case "process_operator":
    case "community_recruiter":
    case "community_admin":
      return "community";
    case "platform_admin":
      return "admin";
  }
  return assertUnreachable(role); // exhaustive switch
}

export function chooseNavRole(
  currentNavRole: NavRole,
  authorizedRoles: RoleName[],
): NavRole {
  // if there are no roles from some reason, fall back to least privileged
  if (authorizedRoles.length === 0) {
    return NAV_ROLES_BY_PRIVILEGE[0];
  }

  const authorizedNavRoles = authorizedRoles.map(convertRoleToNavRole);

  // if our current nav role is in the list, stay with that
  if (authorizedNavRoles.includes(currentNavRole)) {
    return currentNavRole;
  }

  // if we have to change, change to the least privileged
  authorizedNavRoles.sort(
    (a, b) =>
      NAV_ROLES_BY_PRIVILEGE.indexOf(a) - NAV_ROLES_BY_PRIVILEGE.indexOf(b),
  );
  return authorizedNavRoles[0];
}

interface NavContextContainerProps {
  children?: ReactNode;
}

const NavContextContainer = ({ children }: NavContextContainerProps) => {
  const [navRole, setNavRole] = useLocalStorage<NavRole>(NAV_ROLE_KEY, null);
  const { roleAssignments } = useAuthorization();
  const { loggedIn } = useAuthentication();

  const userRoleNames = roleAssignments
    ?.map((a) => a.role?.name)
    .filter((a) => a !== ROLE_NAME.BaseUser)
    .filter(notEmpty) as RoleName[];

  useEffect(() => {
    if (!loggedIn || userRoleNames.length === 0) {
      setNavRole(null);
    }
    // If user is logged in and nav role doesn't exist, then set nav role to least privileged role.
    if (loggedIn && userRoleNames.length !== 0 && navRole === null) {
      const newNavRole = chooseNavRole(null, userRoleNames);
      setNavRole(newNavRole);
    }
  }, [loggedIn, roleAssignments, userRoleNames, setNavRole, navRole]);

  const state = useMemo<NavContextState>(() => {
    return {
      navRole,
      onAuthorizedRolesChanged: (authorizedRoles: RoleName[]) => {
        const newNavRole = chooseNavRole(navRole, authorizedRoles);
        setNavRole(newNavRole);
      },
    };
  }, [navRole, setNavRole]);

  return <NavContext.Provider value={state}>{children}</NavContext.Provider>;
};

export default NavContextContainer;
