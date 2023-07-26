import { Scalars, UpdateUserAsAdminInput } from "~/api/generated";

export type TeamMemberFormValues = {
  user: Scalars["UUID"];
  userDisplay: Scalars["UUID"];
  team: Scalars["UUID"];
  teamDisplay: Scalars["UUID"];
  roles: Array<Scalars["UUID"]>;
};

export type TeamMemberSubmitData = Partial<UpdateUserAsAdminInput>;
