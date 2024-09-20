import {
  DeleteUserMutation,
  Team,
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

export type PoolPickedFields = Pick<
  Pool,
  "id" | "__typename" | "name" | "teamIdForRoleAssignment"
>;
export type CommunityPickedFields = Pick<
  Community,
  "id" | "__typename" | "name" | "teamIdForRoleAssignment"
>;
export type TeamPickedFields = Pick<Team, "id" | "__typename" | "displayName">;
export type Teamable =
  | PoolPickedFields
  | CommunityPickedFields
  | TeamPickedFields;

export interface PoolAssignment {
  pool: PoolPickedFields;
  roles: Role[];
}
export interface CommunityAssignment {
  community: CommunityPickedFields;
  roles: Role[];
}
export interface TeamAssignment {
  team: TeamPickedFields;
  roles: Role[];
}
