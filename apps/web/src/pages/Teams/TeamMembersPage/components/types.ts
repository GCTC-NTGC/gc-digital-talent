import { FragmentType, Scalars } from "@gc-digital-talent/graphql";

import { TeamMembersPage_TeamFragment } from "./operations";

export interface TeamMemberFormValues {
  teamId: Scalars["UUID"]["output"];
  teamDisplay: Scalars["UUID"]["output"];
  userId: Scalars["UUID"]["output"];
  userDisplay: Scalars["UUID"]["output"];
  roles: Scalars["UUID"]["output"][];
}

export type TeamMembersPageFragment = FragmentType<
  typeof TeamMembersPage_TeamFragment
>;
