import React from "react";
import { Maybe, Role } from "../../api/generated";

export type PossibleUserRoles = (Role | null | undefined)[] | null | undefined;
export type MaybeEmail = Maybe<string>;

interface AuthorizationState {
  loggedInUserRoles: PossibleUserRoles;
  loggedInEmail?: PossibleEmail;
}

export const AuthorizationContext = React.createContext<AuthorizationState>({
  loggedInUserRoles: null,
  loggedInEmail: null,
});

interface AuthorizationContainerProps {
  userRoles?: PossibleUserRoles;
  email?: PossibleEmail;
}

export const AuthorizationContainer: React.FC<AuthorizationContainerProps> = ({
  userRoles,
  email,
  children,
}) => {
  const state = React.useMemo<AuthorizationState>(() => {
    return {
      loggedInUserRoles: userRoles,
      loggedInEmail: email,
    };
  }, [userRoles, email]);

  return (
    <AuthorizationContext.Provider value={state}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationContainer;
