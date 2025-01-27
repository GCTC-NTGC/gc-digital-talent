import { createContext, ReactNode, useMemo } from "react";

import { Maybe, UserAuthInfo } from "@gc-digital-talent/graphql";

import { AuthorizationRoleAssignment } from "./AuthorizationProvider";

export interface AuthorizationState {
  roleAssignments: AuthorizationRoleAssignment[];
  userAuthInfo?: Maybe<UserAuthInfo>;
  isLoaded: boolean;
}

export const AuthorizationContext = createContext<AuthorizationState>({
  roleAssignments: [],
  userAuthInfo: null,
  isLoaded: false,
});

interface AuthorizationContainerProps {
  roleAssignments: AuthorizationRoleAssignment[];
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
