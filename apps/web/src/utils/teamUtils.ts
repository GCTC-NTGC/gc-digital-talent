import { IntlShape } from "react-intl";
import orderBy from "lodash/orderBy";

import { RoleName } from "@gc-digital-talent/auth";
import { Maybe, Role, RoleAssignment } from "@gc-digital-talent/graphql";
import { getLocalizedName } from "@gc-digital-talent/i18n";

/**
 * Check to see if user contains one or more roles
 *
 * @param checkRoles              Roles to check for
 * @param userRoleAssignments     Users current role assignments
 * @returns boolean
 */
export const checkRole = (
  checkRoles: RoleName[] | null,
  userRoleAssignments: Maybe<RoleAssignment[]>,
): boolean => {
  if (!checkRoles) {
    return true;
  }
  const visible = checkRoles.reduce((prev, curr) => {
    if (userRoleAssignments?.map((a) => a.role?.name)?.includes(curr)) {
      return true;
    }

    return prev;
  }, false);

  return visible;
};

/**
 * Sort role names
 *
 * @param roles         Roles to sort
 * @param intl          IntlShape
 * @returns sorted roles
 */
export function orderRoles(roles: Role[], intl: IntlShape): Role[] {
  return orderBy(roles, ({ displayName }) => {
    const value = getLocalizedName(displayName, intl);

    return value
      ? value
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLocaleLowerCase()
      : value;
  });
}
