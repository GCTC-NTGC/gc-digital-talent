import { useContext } from "react";

import { NavContext, type NavContextState } from "./NavContextContainer";

const useNavContext = (): NavContextState => {
  const ctx = useContext(NavContext);

  return ctx;
};

export default useNavContext;
