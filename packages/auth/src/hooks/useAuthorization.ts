import { useContext } from "react";

import {
  AuthorizationContext,
  AuthorizationState,
} from "../components/AuthorizationContainer";

const useAuthorization = (): AuthorizationState => {
  const ctx = useContext(AuthorizationContext);

  return ctx;
};

export default useAuthorization;
