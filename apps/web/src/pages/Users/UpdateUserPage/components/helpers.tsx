import React from "react";
import { IntlShape } from "react-intl";

import { Role, User } from "@gc-digital-talent/graphql";
import { Link, Pill } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import RemoveIndividualRoleDialog from "./RemoveIndividualRoleDialog";
import { TeamAssignment, UpdateUserFunc, UpdateUserHandler } from "../types";
import EditTeamRoleDialog from "./EditTeamRoleDialog";
import RemoveTeamRoleDialog from "./RemoveTeamRoleDialog";

export function roleCell(displayName: string) {
  return (
    <Pill color="black" mode="solid">
      {displayName}
    </Pill>
  );
}

export function teamRolesCell(displayNames: string[]) {
  return (
    <div data-h2-display="base(flex)" data-h2-gap="base(0, x.25)">
      {displayNames.map((displayName) => {
        return (
          <Pill color="black" mode="solid" key={displayName}>
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
  onUpdateUser: UpdateUserFunc,
) {
  return (
    <RemoveIndividualRoleDialog
      role={role}
      user={user}
      onUpdateUser={onUpdateUser}
    />
  );
}

export function teamActionCell(
  teamAssignment: TeamAssignment,
  user: User,
  handleUserUpdate: UpdateUserHandler,
  availableRoles: Role[],
) {
  return (
    <div data-h2-display="base(flex)" data-h2-gap="base(0, x.25)">
      <EditTeamRoleDialog
        initialRoles={teamAssignment.roles}
        user={user}
        team={teamAssignment.team}
        onEditRoles={handleUserUpdate}
        allRoles={availableRoles}
      />
      <RemoveTeamRoleDialog
        roles={teamAssignment.roles}
        user={user}
        team={teamAssignment.team}
        onRemoveRoles={handleUserUpdate}
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
