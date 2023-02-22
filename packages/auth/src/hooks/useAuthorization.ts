import { useContext } from "react";

import { AuthorizationContext } from "../components/AuthorizationContainer";

const useAuthorization = () => {
  const ctx = useContext(AuthorizationContext);

  return ctx;
};

export default useAuthorization;
