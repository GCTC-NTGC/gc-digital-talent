import React from "react";

import {
  Maybe,
  User,
  Scalars,
  RoleAssignment,
} from "@gc-digital-talent/graphql";

export interface AuthorizationState {
  roleAssignments: Maybe<Array<RoleAssignment>>;
  email?: Maybe<Scalars["Email"]>;
  deleted: boolean;
  user?: Maybe<User>;
  isLoaded: boolean;
}

export const AuthorizationContext = React.createContext<AuthorizationState>({
  roleAssignments: null,
  email: null,
  deleted: false,
  user: null,
  isLoaded: false,
});

interface AuthorizationContainerProps {
  roleAssignments?: Maybe<Array<RoleAssignment>>;
  email?: Maybe<Scalars["Email"]>;
  deleted: boolean;
  user?: Maybe<User>;
  isLoaded: boolean;
  children?: React.ReactNode;
}

const AuthorizationContainer = ({
  roleAssignments,
  email,
  deleted,
  user,
  isLoaded,
  children,
}: AuthorizationContainerProps) => {
  const state = React.useMemo<AuthorizationState>(() => {
    return {
      roleAssignments,
      email,
      deleted,
      user,
      isLoaded,
    };
  }, [roleAssignments, email, deleted, user, isLoaded]);

  return (
    <AuthorizationContext.Provider value={state}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationContainer;
