import { ReactNode } from "react";

import NavContextContainer from "./NavContextContainer";

interface NavContextProviderProps {
  children?: ReactNode;
}

const NavContextProvider = ({ children }: NavContextProviderProps) => (
  <NavContextContainer>{children}</NavContextContainer>
);

export default NavContextProvider;
