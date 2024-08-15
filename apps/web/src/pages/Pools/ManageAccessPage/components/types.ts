import {
  FragmentType,
  Role,
  Scalars,
  ManageAccessPagePoolFragment as ManageAccessPagePoolFragmentType,
} from "@gc-digital-talent/graphql";

import { ManageAccessPage_PoolFragment } from "./operations";

export type ManageAccessFormValues = {
  teamId: Scalars["UUID"]["output"];
  userId: Scalars["UUID"]["output"];
  userDisplay: Scalars["UUID"]["output"];
  roles: Array<Scalars["UUID"]["output"]>;
};

export type ManageAccessPageFragment = FragmentType<
  typeof ManageAccessPage_PoolFragment
>;

type ManageAccessPagePoolFragmentUserType = NonNullable<
  ManageAccessPagePoolFragmentType["roleAssignments"]
>[number]["user"];

export type PoolTeamMember = {
  roles: Array<Role>;
} & ManageAccessPagePoolFragmentUserType;

export type ManageAccessPagePoolFragmentRoleType = NonNullable<
  ManageAccessPagePoolFragmentType["roleAssignments"]
>[number]["role"];
