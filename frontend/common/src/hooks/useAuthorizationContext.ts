import { useContext } from "react";
import { AuthorizationContext } from "../components/Auth";

const useAuthorizationContext = () => {
  const ctx = useContext(AuthorizationContext);

  return ctx;
};

export default useAuthorizationContext;
