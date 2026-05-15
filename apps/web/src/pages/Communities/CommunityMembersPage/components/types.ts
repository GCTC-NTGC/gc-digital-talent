import type { FragmentType, Scalars } from "@gc-digital-talent/graphql";

import type Hero from "~/components/Hero";

import type { CommunityMembersPage_CommunityFragment } from "./operations";

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
  communityName: string;
  teamId: Scalars["UUID"]["output"] | null | undefined;
  navTabs: React.ComponentProps<typeof Hero>["navTabs"];
  navigationCrumbs: React.ComponentProps<typeof Hero>["crumbs"];
  canAdminManageAccessAndEditCommunity: boolean;
}
