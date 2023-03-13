import {
  UpdateUserAsAdminInput,
  UpdateUserAsAdminMutation,
} from "~/api/generated";

export type UpdateUserFunc = (
  id: string,
  data: UpdateUserAsAdminInput,
) => Promise<UpdateUserAsAdminMutation["updateUserAsAdmin"]>;
