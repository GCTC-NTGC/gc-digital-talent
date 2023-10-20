import { Scalars } from "~/api/generated";

export type TeamMemberFormValues = {
  teamId: Scalars["UUID"];
  teamDisplay: Scalars["UUID"];
  userId: Scalars["UUID"];
  userDisplay: Scalars["UUID"];
  roles: Array<Scalars["UUID"]>;
};
