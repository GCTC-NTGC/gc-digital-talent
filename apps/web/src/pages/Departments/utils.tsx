import { IntlShape } from "react-intl";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  DepartmentSize,
  FragmentType,
  getFragment,
  graphql,
  LocalizedString,
} from "@gc-digital-talent/graphql";
import { Chip } from "@gc-digital-talent/ui";

export type DepartmentType =
  | "isCorePublicAdministration"
  | "isCentralAgency"
  | "isScience"
  | "isRegulatory";

export function departmentTypeToInput(types?: DepartmentType[] | boolean) {
  return {
    isCorePublicAdministration:
      (typeof types === "object" &&
        types?.includes("isCorePublicAdministration")) ??
      false,
    isCentralAgency:
      (typeof types === "object" && types?.includes("isCentralAgency")) ??
      false,
    isScience:
      (typeof types === "object" && types?.includes("isScience")) ?? false,
    isRegulatory:
      (typeof types === "object" && types?.includes("isRegulatory")) ?? false,
  };
}

export function yesNoAccessor(value: boolean, intl: IntlShape) {
  return value
    ? intl.formatMessage(commonMessages.yes)
    : intl.formatMessage(commonMessages.no);
}

export const SIZE_SORT_ORDER = [
  DepartmentSize.Micro,
  DepartmentSize.Small,
  DepartmentSize.Medium,
  DepartmentSize.Large,
  null,
];

export function departmentStatusAccessor(
  archivedAt: string | null | undefined,
  intl: IntlShape,
) {
  return archivedAt
    ? intl.formatMessage(commonMessages.archived)
    : intl.formatMessage(commonMessages.published);
}

export interface MyRoleDepartment {
  departmentId: string;
  roleName: LocalizedString;
}

export function myRolesAccessor(
  departmentId: string,
  myRoleTeams: MyRoleDepartment[],
  intl: IntlShape,
) {
  const departmentFiltered = myRoleTeams.filter(
    (roleDepartment) =>
      roleDepartment.departmentId &&
      roleDepartment.departmentId === departmentId,
  );
  const accessorString = departmentFiltered
    .map((roleDepartment) => getLocalizedName(roleDepartment.roleName, intl))
    .join(", ");

  return accessorString;
}

export function myRolesCell(
  departmentId: string,
  myRoleTeams: MyRoleDepartment[],
  intl: IntlShape,
) {
  const departmentFiltered = myRoleTeams.filter(
    (roleDepartment) =>
      roleDepartment.departmentId &&
      roleDepartment.departmentId === departmentId,
  );

  const rolesChipsArray = departmentFiltered.map((roleDepartment) => (
    <Chip
      color="secondary"
      key={`${departmentId}-${roleDepartment.roleName.en}`}
    >
      {getLocalizedName(roleDepartment.roleName, intl)}
    </Chip>
  ));

  return rolesChipsArray.length > 0 ? <span>{rolesChipsArray}</span> : null;
}

const DepartmentRoleAssignment_Fragment = graphql(/* GraphQL */ `
  fragment DepartmentRoleAssignment on RoleAssignment {
    id
    role {
      id
      name
      displayName {
        en
        fr
      }
      isTeamBased
    }
    teamable {
      ... on Department {
        id
        name {
          en
          fr
        }
      }
    }
  }
`);

// given an array of RoleAssignments, generate array of MyRoleDepartment objects for department roles
export function roleAssignmentsToRoleDepartmentArray(
  query: FragmentType<typeof DepartmentRoleAssignment_Fragment>[],
): MyRoleDepartment[] {
  const roleAssignments = getFragment(DepartmentRoleAssignment_Fragment, query);

  let collection: MyRoleDepartment[] = [];

  roleAssignments.forEach((roleAssignment) => {
    if (
      roleAssignment?.role?.isTeamBased &&
      roleAssignment?.teamable &&
      roleAssignment?.teamable.__typename === "Department" &&
      roleAssignment.role.displayName
    ) {
      const newTeam: MyRoleDepartment = {
        departmentId: roleAssignment.teamable.id,
        roleName: roleAssignment.role.displayName,
      };

      collection = [newTeam, ...collection];
    }
  });

  return collection;
}
