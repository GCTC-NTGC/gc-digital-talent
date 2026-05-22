import type { ReactNode } from "react";
import { createContext, useMemo } from "react";

import type {
  Maybe,
  RoleAssignment,
  RolePermission,
  UserAuthInfo,
} from "@gc-digital-talent/graphql";

type SimpleRoleAssignment = Exclude<RoleAssignment, "teamable">;

export interface AuthorizationState {
  roleAssignments: Maybe<SimpleRoleAssignment[]>;
  rolePermissionMap: RolePermission[];
  userAuthInfo?: Maybe<UserAuthInfo>;
  isLoaded: boolean;
}

export const AuthorizationContext = createContext<AuthorizationState>({
  roleAssignments: null,
  rolePermissionMap: [],
  userAuthInfo: null,
  isLoaded: false,
});

interface AuthorizationContainerProps {
  roleAssignments: Maybe<SimpleRoleAssignment[]>;
  rolePermissionMap: RolePermission[];
  userAuthInfo?: Maybe<UserAuthInfo>;
  isLoaded: boolean;
  children?: ReactNode;
}

const AuthorizationContainer = ({
  roleAssignments,
  rolePermissionMap,
  userAuthInfo,
  isLoaded,
  children,
}: AuthorizationContainerProps) => {
  const state = useMemo<AuthorizationState>(() => {
    return {
      roleAssignments,
      rolePermissionMap,
      userAuthInfo,
      isLoaded,
    };
  }, [roleAssignments, rolePermissionMap, userAuthInfo, isLoaded]);

  return (
    <AuthorizationContext.Provider value={state}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationContainer;
