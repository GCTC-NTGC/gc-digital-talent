import { useContext } from "react";

import { AuthenticationContext } from "../components/AuthenticationContainer";
import { AuthenticationState } from "../types";

const useAuthentication = (): AuthenticationState => {
  const ctx = useContext(AuthenticationContext);

  return ctx;
};

export default useAuthentication;
