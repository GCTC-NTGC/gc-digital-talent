import { Scalars } from "@gc-digital-talent/graphql";

export type TeamMemberFormValues = {
  teamId: Scalars["UUID"]["output"];
  teamDisplay: Scalars["UUID"]["output"];
  userId: Scalars["UUID"]["output"];
  userDisplay: Scalars["UUID"]["output"];
  roles: Array<Scalars["UUID"]["output"]>;
};
