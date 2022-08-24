import React from "react";
import { Maybe, Role, User } from "../../api/generated";

export type PossibleUser = Maybe<User>;
export type PossibleUserRoles = Maybe<Array<Maybe<Role>>>;
export type MaybeEmail = Maybe<string>;

export interface AuthorizationState {
  loggedInUserRoles: PossibleUserRoles;
  loggedInEmail?: MaybeEmail;
  loggedInUser?: PossibleUser;
  isLoaded: boolean;
}

export const AuthorizationContext = React.createContext<AuthorizationState>({
  loggedInUserRoles: null,
  loggedInEmail: null,
  loggedInUser: null,
  isLoaded: false,
});

interface AuthorizationContainerProps {
  userRoles?: PossibleUserRoles;
  email?: MaybeEmail;
  currentUser?: PossibleUser;
  isLoaded: boolean;
}

const AuthorizationContainer: React.FC<AuthorizationContainerProps> = ({
  userRoles,
  email,
  currentUser,
  isLoaded,
  children,
}) => {
  const state = React.useMemo<AuthorizationState>(() => {
    return {
      loggedInUserRoles: userRoles,
      loggedInEmail: email,
      loggedInUser: currentUser,
      isLoaded,
    };
  }, [userRoles, email, currentUser, isLoaded]);

  return (
    <AuthorizationContext.Provider value={state}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationContainer;
