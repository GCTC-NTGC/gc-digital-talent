import orderBy from "lodash/orderBy";
import { IntlShape } from "react-intl";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Link, Chip, Chips } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  Maybe,
  ManageAccessPagePoolFragment as ManageAccessPagePoolFragmentType,
} from "@gc-digital-talent/graphql";

import RemovePoolMembershipDialog from "./RemovePoolMembershipDialog";
import { ManageAccessPagePoolFragmentRoleType, PoolTeamMember } from "./types";

function orderRoles(
  roles: Array<ManageAccessPagePoolFragmentRoleType>,
  intl: IntlShape,
) {
  return orderBy(roles, (role) => {
    const value = getLocalizedName(role?.displayName, intl);

    return value
      ? value
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLocaleLowerCase()
      : value;
  });
}

export const actionCell = (
  user: PoolTeamMember,
  pool: ManageAccessPagePoolFragmentType,
  hasPlatformAdmin: boolean,
) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-wrap="base(wrap)"
    data-h2-gap="base(x.25)"
  >
    <RemovePoolMembershipDialog
      user={user}
      pool={pool}
      hasPlatformAdmin={hasPlatformAdmin}
    />
  </div>
);

export function emailLinkCell(
  email: Maybe<string> | undefined,
  intl: IntlShape,
) {
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

export function roleCell(
  roles: Maybe<Maybe<ManageAccessPagePoolFragmentRoleType>[]>,
  intl: IntlShape,
) {
  const nonEmptyRoles = roles?.filter(notEmpty);
  const roleChips = nonEmptyRoles
    ? orderRoles(nonEmptyRoles, intl).map((role) => (
        <Chip color="secondary" key={role?.id}>
          {getLocalizedName(role?.displayName, intl)}
        </Chip>
      ))
    : null;

  return roleChips ? <Chips>{roleChips}</Chips> : null;
}

export function roleAccessor(
  roles: Maybe<Maybe<ManageAccessPagePoolFragmentRoleType>[]>,
  intl: IntlShape,
) {
  const nonEmptyRoles = roles?.filter(notEmpty);

  return nonEmptyRoles
    ? orderRoles(nonEmptyRoles, intl)
        .map((role) => getLocalizedName(role?.displayName, intl))
        .join(", ")
    : "";
}

export const groupRoleAssignmentsByUser = (
  assignments: ManageAccessPagePoolFragmentType["roleAssignments"],
) => {
  let users: Array<PoolTeamMember> = [];
  const filteredAssignments = assignments?.filter((assignment) => {
    return (
      notEmpty(assignment.user) &&
      notEmpty(assignment.role) &&
      assignment.role.isTeamBased
    );
  });

  filteredAssignments?.forEach((assignment) => {
    const userIndex = users.findIndex(
      (user) => user.id === assignment.user?.id,
    );
    if (userIndex >= 0 && assignment.role) {
      users[userIndex].roles = [...users[userIndex].roles, assignment.role];
    } else if (assignment.user && assignment.role) {
      users = [
        ...users,
        {
          ...assignment.user,
          roles: [assignment.role],
        },
      ];
    }
  });

  return users;
};
