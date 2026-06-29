import type { IntlShape } from "react-intl";

import type {
  Community,
  Department,
  Pool,
  Role,
  Team,
} from "@gc-digital-talent/graphql";
import { uniqueItems, unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import type { DepartmentWithRolesObject } from "./components/ResourcesDepartmentLink";

type PoolTeamable = Pick<Pool, "__typename">;

type CommunityTeamable = Pick<Community, "__typename">;

type TeamTeamable = Pick<Team, "__typename">;

type DepartmentTeamable = Pick<Department, "__typename">;

type Teamable =
  | PoolTeamable
  | CommunityTeamable
  | TeamTeamable
  | DepartmentTeamable;

export const isDepartmentTeamable = (
  teamable: Teamable | undefined | null,
): teamable is DepartmentTeamable => {
  if (teamable?.__typename === "Department") {
    return true;
  }
  return false;
};

export const isPoolTeamable = (
  teamable: Teamable | undefined | null,
): teamable is PoolTeamable => {
  if (teamable?.__typename === "Pool") {
    return true;
  }
  return false;
};

export interface RoleAssignmentObject {
  role?: Pick<Role, "name" | "displayName"> | null;
  teamable?: {
    id?: string;
    name?: {
      __typename?: "LocalizedString" | undefined;
      localized?: string | null | undefined;
    };
  } | null;
}

// given a collection of role assignments filtered to contain department ones only
// return an array of objects that are roles grouped by department
// role assignments -> roles grouped by department
export const departmentAssignmentsToDepartmentRolesObjects = (
  departmentAssignments: RoleAssignmentObject[],
  intl: IntlShape,
): DepartmentWithRolesObject[] => {
  const departmentAssignmentsUnpacked = unpackMaybes(departmentAssignments);
  const departmentIdsArray = uniqueItems(
    unpackMaybes(
      departmentAssignments.map(
        (departmentAssignment) => departmentAssignment.teamable?.id,
      ),
    ),
  );

  const DepartmentWithRolesToReturn: DepartmentWithRolesObject[] =
    departmentIdsArray.map((departmentId) => {
      const relevantRoleAssignments = departmentAssignmentsUnpacked.filter(
        (assign) => assign.teamable?.id === departmentId,
      );
      const departmentObject = relevantRoleAssignments.find(
        (assign) => assign.teamable?.id === departmentId,
      );
      const rolesFromRelevantRoleAssignments = unpackMaybes(
        relevantRoleAssignments.map((assign) => assign?.role),
      );
      const rolesArrayFormatted = rolesFromRelevantRoleAssignments.map(
        (role) => {
          return {
            roleName:
              role.name as DepartmentWithRolesObject["rolesArray"][number]["roleName"],
            roleDisplayName:
              role.displayName?.localized ??
              intl.formatMessage(commonMessages.notFound),
          };
        },
      );

      const departmentName =
        departmentObject?.teamable?.name?.localized ??
        intl.formatMessage(commonMessages.notFound);

      return {
        departmentId: departmentId,
        departmentName: departmentName,
        rolesArray: rolesArrayFormatted,
      };
    });

  return DepartmentWithRolesToReturn;
};
