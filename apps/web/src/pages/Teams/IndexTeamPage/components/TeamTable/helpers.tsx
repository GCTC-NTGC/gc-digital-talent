import { IntlShape } from "react-intl";

import { Link, Chip } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  Maybe,
  RoleAssignment,
  TeamTable_TeamFragment as TeamTableTeamFragmentType,
} from "@gc-digital-talent/graphql";

import { MyRoleTeam } from "./types";

export function viewCell(
  url: string,
  label: Maybe<string>,
  intl: IntlShape,
  currentUrl?: string,
) {
  return (
    <Link href={url} color="black" state={{ from: currentUrl ?? null }}>
      {label ?? intl.formatMessage(commonMessages.noNameProvided)}
    </Link>
  );
}

export function emailCell(email: Maybe<string>, intl: IntlShape) {
  if (email) {
    return (
      <Link color="black" external href={`mailto:${email}`}>
        {email}
      </Link>
    );
  }
  return (
    <span data-h2-font-style="base(italic)">
      {intl.formatMessage({
        defaultMessage: "No email provided",
        id: "1JCjTP",
        description: "Fallback for email value",
      })}
    </span>
  );
}

export function myRolesAccessor(
  teamId: string,
  myRoleTeams: MyRoleTeam[],
  intl: IntlShape,
) {
  // pull out roles associated with the (row's) team id passed in for generating searchable string
  const teamFiltered = myRoleTeams.filter(
    (roleTeam) => roleTeam.teamId && roleTeam.teamId === teamId,
  );
  const accessorString = teamFiltered
    .map((roleTeam) => getLocalizedName(roleTeam.roleName, intl))
    .join(", ");

  return accessorString;
}

export function myRolesCell(
  teamId: string,
  myRoleTeams: MyRoleTeam[],
  intl: IntlShape,
) {
  // pull out roles associated with the (row's) team id passed in for generating UI elements
  const teamFiltered = myRoleTeams.filter(
    (roleTeam) => roleTeam.teamId && roleTeam.teamId === teamId,
  );

  const rolesChipsArray = teamFiltered.map((roleTeam) => (
    <Chip color="primary" key={`${teamId}-${roleTeam.roleName.en}`}>
      {getLocalizedName(roleTeam.roleName, intl)}
    </Chip>
  ));

  return rolesChipsArray.length > 0 ? <span>{rolesChipsArray}</span> : null;
}

// given an array of RoleAssignments
// generate an array of MyRoleTeam objects for team-based roles, filtering out individual roles and empty
// the returned array functions like a map
export function roleAssignmentsToRoleTeamArray(
  roleAssignments: RoleAssignment[],
): MyRoleTeam[] {
  let collection: MyRoleTeam[] = [];

  roleAssignments.forEach((roleAssignment) => {
    if (
      roleAssignment?.role &&
      roleAssignment.role.isTeamBased &&
      roleAssignment?.team &&
      roleAssignment.role.displayName
    ) {
      const newTeam: MyRoleTeam = {
        teamId: roleAssignment.team.id,
        roleName: roleAssignment.role.displayName,
      };

      collection = [newTeam, ...collection];
    }
  });

  return collection;
}

export function departmentAccessor(
  team: TeamTableTeamFragmentType,
  intl: IntlShape,
) {
  return team.departments
    ?.filter(notEmpty)
    .map((department) => getLocalizedName(department?.name, intl, true))
    .filter(notEmpty)
    .join(", ");
}
