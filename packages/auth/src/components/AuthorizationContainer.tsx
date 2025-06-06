import { createContext, ReactNode, useMemo } from "react";

import { Maybe, RoleAssignment, SillyName } from "@gc-digital-talent/graphql";

type SimpleRoleAssignment = Exclude<RoleAssignment, "teamable">;

export interface AuthorizationState {
  roleAssignments: Maybe<SimpleRoleAssignment[]>;
  userAuthInfo?: Maybe<SillyName>;
  isLoaded: boolean;
}

export const AuthorizationContext = createContext<AuthorizationState>({
  roleAssignments: null,
  userAuthInfo: null,
  isLoaded: false,
});

interface AuthorizationContainerProps {
  roleAssignments: Maybe<SimpleRoleAssignment[]>;
  userAuthInfo?: Maybe<SillyName>;
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
