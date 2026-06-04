import type { FragmentType } from "@gc-digital-talent/graphql";

import type Hero from "~/components/Hero";

import type { CommunityMembersPage_CommunityFragment } from "./operations";

export interface CommunityMemberFormValues {
  communityId: string;
  userId: string;
  userDisplay: string;
  roles: string[];
}

export type CommunityMembersPageFragment = FragmentType<
  typeof CommunityMembersPage_CommunityFragment
>;

export interface ContextType {
  communityName: string;
  teamId: string | null | undefined;
  navTabs: React.ComponentProps<typeof Hero>["navTabs"];
  navigationCrumbs: React.ComponentProps<typeof Hero>["crumbs"];
  canAdminManageAccessAndEditCommunity: boolean;
}
