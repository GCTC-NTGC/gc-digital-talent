import type { FragmentType, RoleAssignment } from "@gc-digital-talent/graphql";

import type Hero from "~/components/Hero";

import type { DepartmentManageAccessPage_DepartmentFragment } from "./operations";

export interface DepartmentManageAccessFormValues {
  departmentId: string;
  userId: string;
  userDisplay: string;
  roles: string[];
}

export type DepartmentManageAccessPageFragment = FragmentType<
  typeof DepartmentManageAccessPage_DepartmentFragment
>;

export interface ContextType {
  departmentName: string;
  teamId: string | null | undefined;
  navTabs: React.ComponentProps<typeof Hero>["navTabs"];
  navigationCrumbs: React.ComponentProps<typeof Hero>["crumbs"];
  roleAssignmentsFiltered: RoleAssignment[];
  canViewManageAccess: boolean;
  canEditAdmin: boolean;
  canEditAdvisor: boolean;
}
