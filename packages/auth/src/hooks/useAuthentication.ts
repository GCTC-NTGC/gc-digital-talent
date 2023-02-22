import { useContext } from "react";

import { AuthenticationContext } from "../components/AuthenticationContainer";

const useAuthentication = () => {
  const ctx = useContext(AuthenticationContext);

  return ctx;
};

export default useAuthentication;
