import { Scalars, UpdateUserAsAdminInput } from "~/api/generated";

export type TeamMemberFormValues = {
  user: Scalars["UUID"];
  team: Scalars["UUID"];
  roles: Array<Scalars["UUID"]>;
};

export type TeamMemberSubmitData = Partial<UpdateUserAsAdminInput>;
