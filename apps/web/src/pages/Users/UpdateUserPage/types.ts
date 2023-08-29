import {
  UpdateUserAsAdminInput,
  UpdateUserAsAdminMutation,
  DeleteUserMutation,
} from "@gc-digital-talent/graphql";

export type UpdateUserFunc = (
  id: string,
  data: UpdateUserAsAdminInput,
) => Promise<UpdateUserAsAdminMutation["updateUserAsAdmin"]>;

export type DeleteUserFunc = (
  id: string,
) => Promise<DeleteUserMutation["deleteUser"]>;
