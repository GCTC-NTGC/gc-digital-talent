import React from "react";
import { IntlShape } from "react-intl";

import { Link, Pill } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Role, User } from "@gc-digital-talent/graphql";

import RemoveIndividualRoleDialog from "./RemoveIndividualRoleDialog";
import { TeamAssignment, UpdateUserRolesFunc } from "../types";
import EditTeamRoleDialog from "./EditTeamRoleDialog";
import RemoveTeamRoleDialog from "./RemoveTeamRoleDialog";

export function roleCell(displayName: string) {
  return (
    <Pill color="blackFixed" mode="solid">
      {displayName}
    </Pill>
  );
}

export function teamRolesCell(displayNames: string[]) {
  return (
    <div data-h2-display="base(flex)" data-h2-gap="base(0, x.25)">
      {displayNames.map((displayName) => {
        return (
          <Pill color="blackFixed" mode="solid" key={displayName}>
            {displayName}
          </Pill>
        );
      })}
    </div>
  );
}

export function actionCell(
  role: Role,
  user: User,
  onUpdateUserRoles: UpdateUserRolesFunc,
) {
  return (
    <RemoveIndividualRoleDialog
      role={role}
      user={user}
      onUpdateUserRoles={onUpdateUserRoles}
    />
  );
}

export function teamActionCell(
  teamAssignment: TeamAssignment,
  user: User,
  onUpdateUserRoles: UpdateUserRolesFunc,
  availableRoles: Role[],
) {
  return (
    <div data-h2-display="base(flex)" data-h2-gap="base(0, x.25)">
      <EditTeamRoleDialog
        initialRoles={teamAssignment.roles}
        user={user}
        team={teamAssignment.team}
        onEditRoles={onUpdateUserRoles}
        allRoles={availableRoles}
      />
      <RemoveTeamRoleDialog
        roles={teamAssignment.roles}
        user={user}
        team={teamAssignment.team}
        onRemoveRoles={onUpdateUserRoles}
      />
    </div>
  );
}

export function teamCell(displayName: string, href: string) {
  return (
    <Link color="black" href={href}>
      {displayName}
    </Link>
  );
}

export function teamRolesAccessor(
  teamAssignment: TeamAssignment,
  intl: IntlShape,
) {
  return teamAssignment.roles
    .map((role) => getLocalizedName(role.displayName, intl), true)
    .filter(notEmpty)
    .sort((a, b) => a.localeCompare(b))
    .join();
}
