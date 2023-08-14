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
  deletedDate?: Maybe<Scalars["DateTime"]>;
  user?: Maybe<User>;
  isLoaded: boolean;
}

export const AuthorizationContext = React.createContext<AuthorizationState>({
  roleAssignments: null,
  email: null,
  deletedDate: null,
  user: null,
  isLoaded: false,
});

interface AuthorizationContainerProps {
  roleAssignments?: Maybe<Array<RoleAssignment>>;
  email?: Maybe<Scalars["Email"]>;
  deletedDate?: Maybe<Scalars["DateTime"]>;
  user?: Maybe<User>;
  isLoaded: boolean;
  children?: React.ReactNode;
}

const AuthorizationContainer = ({
  roleAssignments,
  email,
  deletedDate,
  user,
  isLoaded,
  children,
}: AuthorizationContainerProps) => {
  const state = React.useMemo<AuthorizationState>(() => {
    return {
      roleAssignments,
      email,
      deletedDate,
      user,
      isLoaded,
    };
  }, [roleAssignments, email, deletedDate, user, isLoaded]);

  return (
    <AuthorizationContext.Provider value={state}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationContainer;
