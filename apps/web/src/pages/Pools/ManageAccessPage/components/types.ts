import type {
  FragmentType,
  Role,
  ManageAccessPagePoolFragment as ManageAccessPagePoolFragmentType,
} from "@gc-digital-talent/graphql";

import type { ManageAccessPage_PoolFragment } from "./operations";

export interface ManageAccessFormValues {
  teamId: string;
  userId: string;
  userDisplay: string;
  roles: string[];
}

export type ManageAccessPageFragment = FragmentType<
  typeof ManageAccessPage_PoolFragment
>;

type ManageAccessPagePoolFragmentUserType = NonNullable<
  ManageAccessPagePoolFragmentType["roleAssignments"]
>[number]["user"];

export type PoolTeamMember = {
  roles: Role[];
} & ManageAccessPagePoolFragmentUserType;

export type ManageAccessPagePoolFragmentRoleType = NonNullable<
  ManageAccessPagePoolFragmentType["roleAssignments"]
>[number]["role"];
