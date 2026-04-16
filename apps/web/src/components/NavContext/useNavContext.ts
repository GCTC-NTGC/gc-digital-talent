import { useContext } from "react";

import type { NavContextState } from "./NavContextContainer";
import { NavContext } from "./NavContextContainer";

const useNavContext = (): NavContextState => {
  const ctx = useContext(NavContext);

  return ctx;
};

export default useNavContext;
