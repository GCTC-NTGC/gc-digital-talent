import type { ReactNode } from "react";
import { createContext, useMemo } from "react";

import type { RoleAssignment, UserAuthInfo } from "@gc-digital-talent/graphql";

type SimpleRoleAssignment = Exclude<RoleAssignment, "teamable">;

export interface AuthorizationState {
  roleAssignments: SimpleRoleAssignment[] | null;
  userAuthInfo?: UserAuthInfo | null;
  isLoaded: boolean;
}

export const AuthorizationContext = createContext<AuthorizationState>({
  roleAssignments: null,
  userAuthInfo: null,
  isLoaded: false,
});

interface AuthorizationContainerProps {
  roleAssignments: SimpleRoleAssignment[] | null;
  userAuthInfo?: UserAuthInfo | null;
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
