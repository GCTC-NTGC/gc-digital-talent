import {
  DeleteUserMutation,
  Team,
  Role,
  UpdateUserRolesInput,
  UpdateUserRolesMutation,
} from "@gc-digital-talent/graphql";

export type UpdateUserRolesFunc = (
  data: UpdateUserRolesInput,
) => Promise<UpdateUserRolesMutation["updateUserRoles"]>;

export type DeleteUserFunc = (
  id: string,
) => Promise<DeleteUserMutation["deleteUser"]>;

export type TeamAssignment = {
  team: Team;
  roles: Role[];
};
