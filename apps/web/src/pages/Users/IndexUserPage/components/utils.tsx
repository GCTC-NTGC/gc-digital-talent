import { IntlShape } from "react-intl";
import { SortingState } from "@tanstack/react-table";

import {
  notEmpty,
  uniqueItems,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  InputMaybe,
  OrderByClause,
  PositionDuration,
  RoleAssignment,
  SortOrder,
  Trashed,
  UserFilterInput,
} from "@gc-digital-talent/graphql";

import { durationToEnumPositionDuration } from "~/utils/userUtils";

import { FormValues } from "./UserFilterDialog";
import ROLES_TO_HIDE_USERS_TABLE from "./constants";

export function rolesAccessor(
  roleAssignments: RoleAssignment[],
  intl: IntlShape,
): string | null {
  if (!roleAssignments) return null;

  const roles = roleAssignments.map((roleAssignment) => roleAssignment.role);
  const rolesToDisplay = unpackMaybes(roles)
    .filter((role) => !ROLES_TO_HIDE_USERS_TABLE.includes(role.name))
    .map(
      (role) =>
        role.displayName?.localized ??
        intl.formatMessage(commonMessages.notAvailable),
    );
  const uniqueRolesToDisplay = uniqueItems(rolesToDisplay);

  return uniqueRolesToDisplay.join(", ");
}

export function transformUserInput(
  filterState: UserFilterInput | undefined,
  searchBarTerm: string | undefined,
  searchType: string | undefined,
): InputMaybe<UserFilterInput> | undefined {
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
    workEmail: searchType === "workEmail" ? searchBarTerm : undefined,
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

export function transformSortStateToOrderByClause(
  sortingRule?: SortingState,
): OrderByClause | OrderByClause[] | undefined {
  const columnMap = new Map<string, string>([
    ["id", "id"],
    ["candidateName", "first_name"],
    ["email", "email"],
    ["workEmail", "work_email"],
    ["telephone", "telephone"],
    ["preferredLang", "preferred_lang"],
    ["createdDate", "created_at"],
    ["updatedDate", "updated_at"],
  ]);

  const orderBy = sortingRule
    ?.map((rule) => {
      const columnName = columnMap.get(rule.id);
      if (!columnName) return undefined;
      return {
        column: columnName,
        order: rule.desc ? SortOrder.Desc : SortOrder.Asc,
      };
    })
    .filter(notEmpty);

  return orderBy?.length ? orderBy : undefined;
}

export function transformFormValuesToUserFilterInput(
  data: FormValues,
): UserFilterInput {
  return {
    applicantFilter: {
      languageAbility: data.languageAbility,
      locationPreferences: data.workRegion,
      operationalRequirements: data.operationalRequirement,
      flexibleWorkLocations: data.flexibleWorkLocations,
      skills: data.skills.map((skill) => ({ id: skill })),
      positionDuration: data.employmentDuration
        ? [durationToEnumPositionDuration(data.employmentDuration)].filter(
            notEmpty,
          )
        : undefined,
    },
    isGovEmployee: data.govEmployee[0] ? true : undefined,
    isProfileComplete: data.profileComplete[0] ? true : undefined,
    poolFilters: data.pools.map((pool) => ({ poolId: pool })),
    roles: data.roles,
    trashed: data.trashed[0] ? Trashed.Only : undefined,
  };
}

export function transformUserFilterInputToFormValues(
  input: UserFilterInput | undefined,
): FormValues {
  const positionDuration = input?.applicantFilter?.positionDuration;
  return {
    languageAbility: input?.applicantFilter?.languageAbility ?? undefined,
    workRegion: unpackMaybes(input?.applicantFilter?.locationPreferences),
    operationalRequirement: unpackMaybes(
      input?.applicantFilter?.operationalRequirements,
    ),
    flexibleWorkLocations: unpackMaybes(
      input?.applicantFilter?.flexibleWorkLocations,
    ),
    skills: unpackMaybes(
      input?.applicantFilter?.skills?.flatMap((skill) => skill?.id),
    ),
    employmentDuration: !positionDuration?.length
      ? ""
      : positionDuration.includes(PositionDuration.Temporary)
        ? "TERM"
        : "INDETERMINATE",
    govEmployee: input?.isGovEmployee ? "true" : "",
    profileComplete: input?.isProfileComplete ? "true" : "",
    pools: unpackMaybes(
      input?.applicantFilter?.pools?.flatMap((pool) => pool?.id),
    ),
    roles: unpackMaybes(input?.roles),
    trashed: input?.trashed ? "true" : "",
  };
}
