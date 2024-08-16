import { createContext, ReactNode, useMemo, useState } from "react";

import { RoleName } from "@gc-digital-talent/auth";
import { assertUnreachable } from "@gc-digital-talent/helpers";

// this array is ordered by privilege to allow proper sorting
const NAV_ROLES_BY_PRIVILEGE = [
  "guest",
  "applicant",
  "manager",
  "community",
  "admin",
] as const;

export type NavRole = (typeof NAV_ROLES_BY_PRIVILEGE)[number];

export interface NavState {
  navRole: NavRole;
  changeNavRole: (roles: Array<RoleName>) => void;
}

export const NavContext = createContext<NavState>({
  navRole: "guest",
  changeNavRole: () => {
    // no-op
  },
});

function convertRoleToNavRole(role: RoleName): NavRole {
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

function chooseNavRole(
  currentNavRole: NavRole,
  authorizedRoles: Array<RoleName>,
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

interface NavContainerProps {
  children?: ReactNode;
}

const NavContainer = ({ children }: NavContainerProps) => {
  const [navRole, setNavRole] = useState<NavRole>("guest");

  const state = useMemo<NavState>(() => {
    return {
      navRole,
      changeNavRole: (authorizedRoles: Array<RoleName>) => {
        console.debug("changing nav roles: ", authorizedRoles);
        const newNavRole = chooseNavRole(navRole, authorizedRoles);
        console.debug("new nav role: ", newNavRole);
        setNavRole(newNavRole);
      },
    };
  }, [navRole]);

  return <NavContext.Provider value={state}>{children}</NavContext.Provider>;
};

export default NavContainer;
