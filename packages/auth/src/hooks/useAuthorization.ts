import { useContext } from "react";

import type { AuthorizationState } from "../components/AuthorizationContainer";
import { AuthorizationContext } from "../components/AuthorizationContainer";

const useAuthorization = (): AuthorizationState => {
  const ctx = useContext(AuthorizationContext);

  return ctx;
};

export default useAuthorization;
