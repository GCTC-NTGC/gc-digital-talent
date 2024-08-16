import { useContext } from "react";

import { NavContext, NavState } from "./NavContainer";

const useNav = (): NavState => {
  const ctx = useContext(NavContext);

  return ctx;
};

export default useNav;
