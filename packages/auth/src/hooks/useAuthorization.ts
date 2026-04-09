import { useContext } from "react";

import {
  AuthorizationContext,
  type AuthorizationState,
} from "../components/AuthorizationContainer";

const useAuthorization = (): AuthorizationState => {
  const ctx = useContext(AuthorizationContext);

  return ctx;
};

export default useAuthorization;
