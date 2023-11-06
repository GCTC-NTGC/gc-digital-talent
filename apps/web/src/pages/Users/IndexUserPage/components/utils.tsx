import { IntlShape } from "react-intl";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  InputMaybe,
  RoleAssignment,
  UserFilterInput,
} from "@gc-digital-talent/graphql";
import { notEmpty, uniqueItems } from "@gc-digital-talent/helpers";
import { getLocalizedName } from "@gc-digital-talent/i18n";

export function rolesAccessor(
  roleAssignments: RoleAssignment[],
  intl: IntlShape,
): string | null {
  if (!roleAssignments) return null;

  const roles = roleAssignments.map((roleAssignment) => roleAssignment.role);
  const rolesFiltered = roles.filter(notEmpty);
  // custom selection of roles of note for table viewing, most likely kept in sync with options in the filter dialog
  const rolesToDisplay = rolesFiltered
    .filter(
      (role) =>
        role.name === ROLE_NAME.PlatformAdmin ||
        role.name === ROLE_NAME.PoolOperator ||
        role.name === ROLE_NAME.RequestResponder,
    )
    .map((role) => getLocalizedName(role.displayName, intl));
  const uniqueRolesToDisplay = uniqueItems(rolesToDisplay);

  return uniqueRolesToDisplay.join(", ");
}

export function transformUserInput(
  filterState: UserFilterInput | undefined,
  searchBarTerm: string | undefined,
  searchType: string | undefined,
): InputMaybe<UserFilterInput> {
  if (
    filterState === undefined &&
    searchBarTerm === undefined &&
    searchType === undefined
  ) {
    return undefined;
  }

  return {
    // search bar
    generalSearch: searchBarTerm && !searchType ? searchBarTerm : undefined,
    email: searchType === "email" ? searchBarTerm : undefined,
    name: searchType === "name" ? searchBarTerm : undefined,
    telephone: searchType === "phone" ? searchBarTerm : undefined,

    // from fancy filter
    applicantFilter: filterState?.applicantFilter,
    isGovEmployee: filterState?.isGovEmployee,
    isProfileComplete: filterState?.isProfileComplete,
    poolFilters: filterState?.poolFilters,
    roles: filterState?.roles,
    trashed: filterState?.trashed,
  };
}
