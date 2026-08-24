import type { LocalizedString, Permission } from "@gc-digital-talent/graphql";

export interface AuthenticationState {
  loggedIn: boolean;
  logout: (postLogoutUri?: string) => void;
  refreshTokenSet: () => Promise<void>;
}

export interface AuthRole {
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

export interface AuthPoolTeamable {
  __typename: "Pool";
  id: string;
  name?: LocalizedString | null;
  teamIdForRoleAssignment?: string | null;
}

export interface AuthCommunityTeamable {
  __typename: "Community";
  id: string;
  name?: LocalizedString | null;
  teamIdForRoleAssignment?: string | null;
}

export interface AuthDepartmentTeamable {
  __typename: "Department";
  id: string;
  departmentName: LocalizedString;
  teamIdForRoleAssignment?: string | null;
}

export interface AuthTeamTeamable {
  __typename: "Team";
  id: string;
}

export type AuthTeamable =
  | AuthPoolTeamable
  | AuthCommunityTeamable
  | AuthDepartmentTeamable
  | AuthTeamTeamable;

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
