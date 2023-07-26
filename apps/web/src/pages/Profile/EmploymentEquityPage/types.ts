/* Note: Just defining func signature */
/* eslint-disable no-unused-vars */
import type {
  UpdateUserAsUserInput,
  UpdateUserAsUserMutation,
} from "~/api/generated";

export type EquityKeys =
  | "isWoman"
  | "indigenousCommunities"
  | "isVisibleMinority"
  | "hasDisability";

export type EmploymentEquityUpdateHandler = (
  id: string,
  data: UpdateUserAsUserInput,
) => Promise<UpdateUserAsUserMutation["updateUserAsUser"]>;
