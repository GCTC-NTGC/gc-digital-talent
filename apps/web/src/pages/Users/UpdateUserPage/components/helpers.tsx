import { IntlShape } from "react-intl";

import { Link, Chip, Chips } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Role, User } from "@gc-digital-talent/graphql";

import RemoveIndividualRoleDialog from "./RemoveIndividualRoleDialog";
import {
  CommunityPickedFields,
  PoolPickedFields,
  Teamable,
  TeamAssignment,
  TeamPickedFields,
  UpdateUserRolesFunc,
} from "../types";
import EditTeamRoleDialog from "./EditTeamRoleDialog";
import RemoveTeamRoleDialog from "./RemoveTeamRoleDialog";

export function roleCell(displayName: string) {
  return <Chip color="black">{displayName}</Chip>;
}

export function teamRolesCell(displayNames: string[]) {
  return (
    <Chips>
      {displayNames.map((displayName) => {
        return (
          <Chip color="black" key={displayName}>
            {displayName}
          </Chip>
        );
      })}
    </Chips>
  );
}

export function actionCell(
  role: Role,
  user: Pick<User, "id" | "firstName" | "lastName">,
  onUpdateUserRoles: UpdateUserRolesFunc,
) {
  return (
    <RemoveIndividualRoleDialog
      role={role}
      userId={user.id}
      firstName={user.firstName}
      lastName={user.lastName}
      onUpdateUserRoles={onUpdateUserRoles}
    />
  );
}

export function teamActionCell(
  teamAssignment: TeamAssignment,
  user: Pick<User, "id" | "firstName" | "lastName">,
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

export const isPoolTeamable = (
  teamable: Teamable,
): teamable is PoolPickedFields => {
  if (teamable.__typename === "Pool") {
    return true;
  }
  return false;
};

export const isCommunityTeamable = (
  teamable: Teamable,
): teamable is CommunityPickedFields => {
  if (teamable.__typename === "Community") {
    return true;
  }
  return false;
};

export const isTeamTeamable = (
  teamable: Teamable | undefined | null,
): teamable is TeamPickedFields => {
  if (teamable && teamable.__typename === "Team") {
    return true;
  }
  return false;
};
