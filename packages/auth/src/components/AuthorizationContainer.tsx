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
  user?: Maybe<User>;
  isLoaded: boolean;
}

export const AuthorizationContext = React.createContext<AuthorizationState>({
  roleAssignments: null,
  email: null,
  user: null,
  isLoaded: false,
});

interface AuthorizationContainerProps {
  roleAssignments?: Maybe<Array<RoleAssignment>>;
  email?: Maybe<Scalars["Email"]>;
  user?: Maybe<User>;
  isLoaded: boolean;
  children?: React.ReactNode;
}

const AuthorizationContainer: React.FC<AuthorizationContainerProps> = ({
  roleAssignments,
  email,
  user,
  isLoaded,
  children,
}) => {
  const state = React.useMemo<AuthorizationState>(() => {
    return {
      roleAssignments,
      email,
      user,
      isLoaded,
    };
  }, [roleAssignments, email, user, isLoaded]);

  return (
    <AuthorizationContext.Provider value={state}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationContainer;
