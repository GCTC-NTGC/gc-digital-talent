import { FragmentType, Scalars } from "@gc-digital-talent/graphql";

import { CommunityMembersPage_CommunityFragment } from "./operations";

export type CommunityMemberFormValues = {
  communityId: Scalars["UUID"]["output"];
  userId: Scalars["UUID"]["output"];
  userDisplay: Scalars["UUID"]["output"];
  roles: Array<Scalars["UUID"]["output"]>;
};

export type CommunityMembersPageFragment = FragmentType<
  typeof CommunityMembersPage_CommunityFragment
>;

export type ContextType = { teamId: Scalars["UUID"]["output"] };
