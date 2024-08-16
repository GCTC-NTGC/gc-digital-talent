import { ReactNode } from "react";

import { useAuthorization } from "@gc-digital-talent/auth";

import NavContainer from "./NavContainer";

interface NavProviderProps {
  children?: ReactNode;
}

const NavProvider = ({ children }: NavProviderProps) => {
  const authorizationState = useAuthorization();

  return (
    <NavContainer authorizationState={authorizationState}>
      {children}
    </NavContainer>
  );
};

export default NavProvider;
