import { useContext } from "react";

import {
  AuthenticationContext,
  AuthenticationState,
} from "../components/AuthenticationContainer";

const useAuthentication = (): AuthenticationState => {
  const ctx = useContext(AuthenticationContext);

  return ctx;
};

export default useAuthentication;
