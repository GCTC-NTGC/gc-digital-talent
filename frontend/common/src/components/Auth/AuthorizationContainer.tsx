import React from "react";
import { Maybe, Role } from "../../api/generated";

export type PossibleUserRoles = Maybe<Array<Maybe<Role>>>;
export type MaybeEmail = Maybe<string>;

interface AuthorizationState {
  loggedInUserRoles: PossibleUserRoles;
  loggedInEmail?: MaybeEmail;
  isLoaded: boolean;
}

export const AuthorizationContext = React.createContext<AuthorizationState>({
  loggedInUserRoles: null,
  loggedInEmail: null,
  isLoaded: false,
});

interface AuthorizationContainerProps {
  userRoles?: PossibleUserRoles;
  email?: MaybeEmail;
  isLoaded: boolean;
}

export const AuthorizationContainer: React.FC<AuthorizationContainerProps> = ({
  userRoles,
  email,
  isLoaded,
  children,
}) => {
  const state = React.useMemo<AuthorizationState>(() => {
    return {
      loggedInUserRoles: userRoles,
      loggedInEmail: email,
      isLoaded,
    };
  }, [userRoles, email, isLoaded]);

  return (
    <AuthorizationContext.Provider value={state}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationContainer;
