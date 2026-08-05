import type { LocalizedString, Permission } from "@gc-digital-talent/graphql";

export interface AuthenticationState {
  loggedIn: boolean;
  logout: (postLogoutUri?: string) => void;
  refreshTokenSet: () => Promise<void>;
}

interface AuthRole {
  id: string;
  name: string;
  isTeamBased?: boolean | null;
  permissions?: Permission[] | null;
  displayName?: LocalizedString | null;
}

interface AuthTeam {
  id: string;
  name: string;
}

export interface AuthRoleAssignment {
  id: string;
  role?: AuthRole | null;
  team?: AuthTeam | null;
  teamable?: { id: string } | null;
}

export interface AuthUserInfo {
  id: string;
  deletedDate?: string | null;
  roleAssignments?: (AuthRoleAssignment | null)[] | null;
}
