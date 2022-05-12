import React from "react";
import { Role, useGetMeQuery } from "../api/generated";

interface AuthorizationState {
  loggedInUserRoles: (Role | null | undefined)[] | null | undefined;
}

export const AuthorizationContext = React.createContext<AuthorizationState>({
  loggedInUserRoles: null,
});

export const AuthorizationContainer: React.FC = ({ children }) => {
  const [result] = useGetMeQuery();
  const { data } = result;
  const state = React.useMemo<AuthorizationState>(() => {
    return {
      loggedInUserRoles: data?.me?.roles,
    };
  }, [data?.me?.roles]);

  return (
    <AuthorizationContext.Provider value={state}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationContainer;
