import React from "react";
import { Role } from "../../api/generated";

export type PossibleUserRoles = (Role | null | undefined)[] | null | undefined;

interface AuthorizationState {
  loggedInUserRoles: PossibleUserRoles;
}

export const AuthorizationContext = React.createContext<AuthorizationState>({
  loggedInUserRoles: null,
});

interface AuthorizationContainerProps {
  userRoles?: PossibleUserRoles;
}

export const AuthorizationContainer: React.FC<AuthorizationContainerProps> = ({
  userRoles,
  children,
}) => {
  const state = React.useMemo<AuthorizationState>(() => {
    return {
      loggedInUserRoles: userRoles,
    };
  }, [userRoles]);

  return (
    <AuthorizationContext.Provider value={state}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationContainer;
