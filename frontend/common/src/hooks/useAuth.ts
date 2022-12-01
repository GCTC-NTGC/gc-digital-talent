import { useContext } from "react";
import { AuthenticationContext } from "../components/Auth/AuthenticationContainer";

const useAuth = () => {
  const ctx = useContext(AuthenticationContext);

  return ctx;
};

export default useAuth;
