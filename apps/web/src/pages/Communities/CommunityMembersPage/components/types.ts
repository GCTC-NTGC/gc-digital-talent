import { FragmentType, Scalars } from "@gc-digital-talent/graphql";

import { CommunityMembersPage_CommunityFragment } from "./operations";

export interface CommunityMemberFormValues {
  communityId: Scalars["UUID"]["output"];
  userId: Scalars["UUID"]["output"];
  userDisplay: Scalars["UUID"]["output"];
  roles: Scalars["UUID"]["output"][];
}

export type CommunityMembersPageFragment = FragmentType<
  typeof CommunityMembersPage_CommunityFragment
>;

export interface ContextType {
  teamId: Scalars["UUID"]["output"];
  canAdmin: boolean;
}
