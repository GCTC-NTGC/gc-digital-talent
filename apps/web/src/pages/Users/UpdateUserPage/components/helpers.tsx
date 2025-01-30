import { IntlShape } from "react-intl";

import { Link, Chip, Chips } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Role, User } from "@gc-digital-talent/graphql";

import RemoveIndividualRoleDialog from "./RemoveIndividualRoleDialog";
import {
  CommunityAssignment,
  CommunityTeamable,
  PoolAssignment,
  PoolTeamable,
  Teamable,
  UpdateUserRolesFunc,
} from "../types";
import EditCommunityRoleDialog from "./EditCommunityRoleDialog";
import RemoveCommunityRoleDialog from "./RemoveCommunityRoleDialog";
import EditProcessRoleDialog from "./EditProcessRoleDialog";
import RemoveProcessRoleDialog from "./RemoveProcessRoleDialog";

export function roleCell(displayName: string) {
  return <Chip color="secondary">{displayName}</Chip>;
}

export function teamRolesCell(displayNames: string[]) {
  return (
    <Chips>
      {displayNames.map((displayName) => {
        return (
          <Chip color="secondary" key={displayName}>
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

export function communityActionCell(
  communityAssignment: CommunityAssignment,
  user: Pick<User, "id" | "firstName" | "lastName">,
  onUpdateUserRoles: UpdateUserRolesFunc,
  communityRoles: Role[],
) {
  return (
    <div data-h2-display="base(flex)" data-h2-gap="base(0, x.25)">
      <EditCommunityRoleDialog
        initialRoles={communityAssignment.roles}
        user={user}
        community={communityAssignment.community}
        onEditRoles={onUpdateUserRoles}
        communityRoles={communityRoles}
      />
      <RemoveCommunityRoleDialog
        roles={communityAssignment.roles}
        user={user}
        community={communityAssignment.community}
        onRemoveRoles={onUpdateUserRoles}
      />
    </div>
  );
}

export function communityCell(displayName: string, href: string) {
  return (
    <Link color="secondary" href={href} data-h2-font-weight="base(700)">
      {displayName}
    </Link>
  );
}

export function communityRolesAccessor(
  teamAssignment: CommunityAssignment,
  intl: IntlShape,
) {
  return teamAssignment.roles
    .map((role) => getLocalizedName(role.displayName, intl), true)
    .filter(notEmpty)
    .sort((a, b) => a.localeCompare(b))
    .join();
}

export function processActionCell(
  poolAssignment: PoolAssignment,
  user: Pick<User, "id" | "firstName" | "lastName">,
  onUpdateUserRoles: UpdateUserRolesFunc,
  processRoles: Role[],
) {
  return (
    <div data-h2-display="base(flex)" data-h2-gap="base(0, x.25)">
      <EditProcessRoleDialog
        initialRoles={poolAssignment.roles}
        user={user}
        pool={poolAssignment.pool}
        onEditRoles={onUpdateUserRoles}
        processRoles={processRoles}
      />
      <RemoveProcessRoleDialog
        roles={poolAssignment.roles}
        user={user}
        pool={poolAssignment.pool}
        onRemoveRoles={onUpdateUserRoles}
      />
    </div>
  );
}

export function processCell(displayName: string, href: string) {
  return (
    <Link color="secondary" href={href} data-h2-font-weight="base(700)">
      {displayName}
    </Link>
  );
}

export function processRolesAccessor(
  poolAssignment: PoolAssignment,
  intl: IntlShape,
) {
  return poolAssignment.roles
    .map((role) => getLocalizedName(role.displayName, intl), true)
    .filter(notEmpty)
    .sort((a, b) => a.localeCompare(b))
    .join();
}

export const isPoolTeamable = (
  teamable: Teamable | undefined | null,
): teamable is PoolTeamable => {
  if (teamable && teamable.__typename === "Pool") {
    return true;
  }
  return false;
};

export const isCommunityTeamable = (
  teamable: Teamable | undefined | null,
): teamable is CommunityTeamable => {
  if (teamable && teamable.__typename === "Community") {
    return true;
  }
  return false;
};
