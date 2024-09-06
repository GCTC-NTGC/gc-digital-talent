import { createContext, ReactNode, useMemo } from "react";

import {
  Maybe,
  RoleAssignment,
  UserAuthInfo,
} from "@gc-digital-talent/graphql";

export interface AuthorizationState {
  roleAssignments: Maybe<RoleAssignment[]>;
  userAuthInfo?: Maybe<UserAuthInfo>;
  isLoaded: boolean;
}

export const AuthorizationContext = createContext<AuthorizationState>({
  roleAssignments: null,
  userAuthInfo: null,
  isLoaded: false,
});

interface AuthorizationContainerProps {
  roleAssignments: Maybe<RoleAssignment[]>;
  userAuthInfo?: Maybe<UserAuthInfo>;
  isLoaded: boolean;
  children?: ReactNode;
}

const AuthorizationContainer = ({
  roleAssignments,
  userAuthInfo,
  isLoaded,
  children,
}: AuthorizationContainerProps) => {
  const state = useMemo<AuthorizationState>(() => {
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
