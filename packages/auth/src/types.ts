import type { LocalizedString, Permission } from "@gc-digital-talent/graphql";

export interface AuthenticationState {
  loggedIn: boolean;
  logout: (postLogoutUri?: string) => void;
  refreshTokenSet: () => Promise<void>;
}

export interface AuthRole {
  name: string;
  isTeamBased?: boolean | null;
  permissions?: Permission[] | null;
  displayName?: LocalizedString | null;
}

export interface AuthTeam {
  id: string;
  name?: string | null;
}

export interface AuthRoleAssignment {
  id: string;
  role?: AuthRole | null;
  team?: AuthTeam | null;
}

export interface AuthUserInfo {
  id: string;
  deletedDate?: string | null;
  roleAssignments?: (AuthRoleAssignment | null)[] | null;
}
