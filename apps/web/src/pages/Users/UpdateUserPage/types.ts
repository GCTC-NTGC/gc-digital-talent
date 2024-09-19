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

export type PoolPickedFields = Pick<Pool, "id" | "__typename" | "name">;
export type CommunityPickedFields = Pick<
  Community,
  "id" | "__typename" | "name"
>;
export type TeamPickedFields = Pick<Team, "id" | "__typename" | "displayName">;
export type Teamable =
  | PoolPickedFields
  | CommunityPickedFields
  | TeamPickedFields;

export interface TeamAssignment {
  team: TeamPickedFields;
  roles: Role[];
}
