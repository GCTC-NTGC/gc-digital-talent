import {
  DeleteUserMutation,
  Role,
  UpdateUserRolesInput,
  UpdateUserRolesMutation,
  Pool,
  Community,
} from "@gc-digital-talent/graphql";

export type UpdateUserRolesFunc = (
  data: UpdateUserRolesInput,
) => Promise<UpdateUserRolesMutation["updateUserRoles"]>;

export type DeleteUserFunc = (
  id: string,
) => Promise<DeleteUserMutation["deleteUser"]>;

export type PoolTeamable = Pick<
  Pool,
  "id" | "__typename" | "name" | "teamIdForRoleAssignment"
>;
export type CommunityTeamable = Pick<
  Community,
  "id" | "__typename" | "name" | "teamIdForRoleAssignment"
>;
export type Teamable = PoolTeamable | CommunityTeamable;

export interface PoolAssignment {
  pool: PoolTeamable;
  roles: Role[];
}
export interface CommunityAssignment {
  community: CommunityTeamable;
  roles: Role[];
}
