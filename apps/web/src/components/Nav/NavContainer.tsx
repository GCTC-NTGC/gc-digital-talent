import { createContext, ReactNode, useMemo, useState } from "react";

import { useAuthorization } from "@gc-digital-talent/auth";

export type NavRole = "guest" | "applicant" | "manager" | "community" | "admin";

export interface NavState {
  navRole: NavRole;
  changeNavRole: (navRole: NavRole) => void;
}

export const NavContext = createContext<NavState>({
  navRole: "guest",
  changeNavRole: () => {},
});

interface NavContainerProps {
  authorizationState: ReturnType<typeof useAuthorization>;
  children?: ReactNode;
}

const NavContainer = ({ authorizationState, children }: NavContainerProps) => {
  const [navRole, setNavRole] = useState<NavRole>("guest");

  const state = useMemo<NavState>(() => {
    return {
      navRole,
      changeNavRole: setNavRole,
    };
  }, [navRole]);

  return <NavContext.Provider value={state}>{children}</NavContext.Provider>;
};

export default NavContainer;
