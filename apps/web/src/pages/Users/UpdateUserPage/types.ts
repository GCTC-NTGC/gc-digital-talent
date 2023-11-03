import {
  UpdateUserAsAdminInput,
  UpdateUserAsAdminMutation,
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

export type UpdateUserHandler = (
  submitData: UpdateUserAsAdminInput,
) => Promise<UpdateUserAsAdminMutation["updateUserAsAdmin"]>;

export type TeamAssignment = {
  team: Team;
  roles: Role[];
};
