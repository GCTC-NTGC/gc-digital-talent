import React from "react";

import {
  Maybe,
  RoleAssignment,
  UserAuthInfo,
} from "@gc-digital-talent/graphql";

export interface AuthorizationState {
  roleAssignments: Maybe<Array<RoleAssignment>>;
  userAuthInfo?: Maybe<UserAuthInfo>;
  isLoaded: boolean;
}

export const AuthorizationContext = React.createContext<AuthorizationState>({
  roleAssignments: null,
  userAuthInfo: null,
  isLoaded: false,
});

interface AuthorizationContainerProps {
  roleAssignments: Maybe<Array<RoleAssignment>>;
  userAuthInfo?: Maybe<UserAuthInfo>;
  isLoaded: boolean;
  children?: React.ReactNode;
}

const AuthorizationContainer = ({
  roleAssignments,
  userAuthInfo,
  isLoaded,
  children,
}: AuthorizationContainerProps) => {
  const state = React.useMemo<AuthorizationState>(() => {
    return {
      roleAssignments,
      userAuthInfo,
      isLoaded,
    };
  }, [roleAssignments, userAuthInfo, isLoaded]);

  return (
    <AuthorizationContext.Provider value={state}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationContainer;
