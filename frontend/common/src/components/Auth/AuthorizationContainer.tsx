import React from "react";
import { Maybe, Role } from "../../api/generated";

export type PossibleUserRoles = Maybe<Array<Maybe<Role>>>;
export type MaybeEmail = Maybe<string>;

interface AuthorizationState {
  loggedInUserRoles: PossibleUserRoles;
  loggedInEmail?: MaybeEmail;
}

export const AuthorizationContext = React.createContext<AuthorizationState>({
  loggedInUserRoles: null,
  loggedInEmail: null,
});

interface AuthorizationContainerProps {
  userRoles?: PossibleUserRoles;
  email?: MaybeEmail;
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
