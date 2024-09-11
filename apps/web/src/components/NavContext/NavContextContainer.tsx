import { createContext, ReactNode, useMemo, useState } from "react";

import { RoleName } from "@gc-digital-talent/auth";
import { assertUnreachable } from "@gc-digital-talent/helpers";
import { useLogger } from "@gc-digital-talent/logger";

// this array is ordered by privilege to allow proper sorting
const NAV_ROLES_BY_PRIVILEGE = [
  "guest",
  "applicant",
  "manager",
  "community",
  "admin",
] as const;

export type NavRole = (typeof NAV_ROLES_BY_PRIVILEGE)[number];

export interface NavContextState {
  navRole: NavRole;
  onAuthorizedRolesChanged: (roles: RoleName[]) => void;
}

export const NavContext = createContext<NavContextState>({
  navRole: "guest",
  onAuthorizedRolesChanged: () => {
    // no-op
  },
});

export function convertRoleToNavRole(role: RoleName): NavRole {
  switch (role) {
    case "guest":
    case "base_user":
      return "guest";
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
  const [navRole, setNavRole] = useState<NavRole>("guest");
  const logger = useLogger();

  const state = useMemo<NavContextState>(() => {
    return {
      navRole,
      onAuthorizedRolesChanged: (authorizedRoles: RoleName[]) => {
        const newNavRole = chooseNavRole(navRole, authorizedRoles);
        logger.debug(`new nav role: ${newNavRole}`); // feel free to remove this in  #10793 when the container is used
        setNavRole(newNavRole);
      },
    };
  }, [logger, navRole]);

  return <NavContext.Provider value={state}>{children}</NavContext.Provider>;
};

export default NavContextContainer;
