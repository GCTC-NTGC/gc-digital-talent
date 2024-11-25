import { FragmentType, Scalars } from "@gc-digital-talent/graphql";

import Hero from "~/components/Hero";

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
  communityName: string;
  teamId: Scalars["UUID"]["output"] | null | undefined;
  navTabs: React.ComponentProps<typeof Hero>["navTabs"];
  navigationCrumbs: React.ComponentProps<typeof Hero>["crumbs"];
  canAdmin: boolean;
}
