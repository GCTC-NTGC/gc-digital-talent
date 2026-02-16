import { FragmentType, Scalars } from "@gc-digital-talent/graphql";

import Hero from "~/components/Hero";

import { DepartmentManageAccessPage_DepartmentFragment } from "./operations";

export interface DepartmentManageAccessFormValues {
  departmentId: Scalars["UUID"]["output"];
  userId: Scalars["UUID"]["output"];
  userDisplay: Scalars["UUID"]["output"];
  roles: Scalars["UUID"]["output"][];
}

export type DepartmentManageAccessPageFragment = FragmentType<
  typeof DepartmentManageAccessPage_DepartmentFragment
>;

export interface ContextType {
  departmentName: string;
  teamId: Scalars["UUID"]["output"] | null | undefined;
  navTabs: React.ComponentProps<typeof Hero>["navTabs"];
  navigationCrumbs: React.ComponentProps<typeof Hero>["crumbs"];
  canAdminManageAccess: boolean;
}
