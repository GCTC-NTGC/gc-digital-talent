import type { SortingState } from "@tanstack/react-table";
import type { IntlShape } from "react-intl";
import type { JSX } from "react";

import type {
  QueryCommunityInterestsPaginatedOrderByRelationOrderByClause,
  CommunityInterestFilterInput,
} from "@gc-digital-talent/graphql";
import {
  CommunityInterestsOrderByColumn,
  QueryCommunityInterestsPaginatedOrderByUserColumn,
  SortOrder,
  OrderByRelationWithColumnAggregateFunction,
  PositionDuration,
} from "@gc-digital-talent/graphql";
import { Link } from "@gc-digital-talent/ui";
import { commonMessages, EmploymentDuration } from "@gc-digital-talent/i18n";
import { uniqueItems, unpackMaybes } from "@gc-digital-talent/helpers";

import type useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";
import { durationToEnumPositionDuration } from "~/utils/userUtils";

import type { FormValues } from "./components/CommunityTalentFilterDialog";

export function transformSortStateToOrderByClause(
  sortingRules: SortingState,
  filterState?: CommunityInterestFilterInput,
): QueryCommunityInterestsPaginatedOrderByRelationOrderByClause {
  const columnMap = new Map<string, CommunityInterestsOrderByColumn>([
    ["createdAt", CommunityInterestsOrderByColumn.CreatedAt],
    ["jobInterest", CommunityInterestsOrderByColumn.JobInterest],
    ["trainingInterest", CommunityInterestsOrderByColumn.TrainingInterest],
    ["skillCount", CommunityInterestsOrderByColumn.SkillCount],
  ]);
  const userColumnMap = new Map<
    string,
    QueryCommunityInterestsPaginatedOrderByUserColumn
  >([
    ["userName", QueryCommunityInterestsPaginatedOrderByUserColumn.FirstName],
    ["workEmail", QueryCommunityInterestsPaginatedOrderByUserColumn.WorkEmail],
    [
      "preferredLang",
      QueryCommunityInterestsPaginatedOrderByUserColumn.PreferredLang,
    ],
  ]);

  const sortingRule = sortingRules?.find(
    (rule) => columnMap.has(rule.id) || userColumnMap.has(rule.id),
  );

  if (
    sortingRule &&
    ["jobInterest", "trainingInterest", "createdAt"].includes(sortingRule.id)
  ) {
    return {
      column: columnMap.get(sortingRule.id),
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      user: undefined,
    };
  }

  if (
    sortingRule &&
    ["userName", "preferredLang", "workEmail"].includes(sortingRule.id)
  ) {
    return {
      column: undefined,
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      user: {
        aggregate: OrderByRelationWithColumnAggregateFunction.Max,
        column: userColumnMap.get(sortingRule.id),
      },
    };
  }

  if (
    sortingRule?.id === "skillCount" &&
    filterState?.skills &&
    filterState.skills.length > 0
  ) {
    return {
      column: CommunityInterestsOrderByColumn.SkillCount,
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      user: undefined,
    };
  }

  // default final sort is column FIRST_NAME
  return {
    column: undefined,
    order: SortOrder.Asc,
    user: {
      aggregate: OrderByRelationWithColumnAggregateFunction.Max,
      column: QueryCommunityInterestsPaginatedOrderByUserColumn.FirstName,
    },
  };
}

export function getClassificationSort(
  sortingState?: SortingState,
): SortOrder | null {
  const sortRule = sortingState?.find((rule) => rule.id === "classification");
  if (sortRule) {
    return sortRule.desc ? SortOrder.Desc : SortOrder.Asc;
  }
  return null;
}

export const usernameCell = (
  userId: string,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
  firstName?: string | null,
  lastName?: string | null,
): JSX.Element => {
  const userName = getFullNameLabel(firstName, lastName, intl);
  return <Link href={paths.userEmployeeProfile(userId)}>{userName}</Link>;
};

export function interestAccessor(
  intl: IntlShape,
  interest?: boolean | null,
): string {
  if (interest) {
    return intl.formatMessage(commonMessages.interested);
  }
  if (interest === false) {
    return intl.formatMessage(commonMessages.notInterested);
  }
  return "";
}

export function transformCommunityTalentInput(
  filterState: CommunityInterestFilterInput | undefined,
  searchBarTerm: string | undefined,
  searchType: string | undefined,
): CommunityInterestFilterInput | null | undefined {
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

    // from fancy filter
    communities: filterState?.communities,
    workStreams: filterState?.workStreams,
    classifications: filterState?.classifications,
    poolFilters: filterState?.poolFilters,
    jobInterest: filterState?.jobInterest,
    trainingInterest: filterState?.trainingInterest,
    lateralMoveInterest: filterState?.lateralMoveInterest,
    promotionMoveInterest: filterState?.promotionMoveInterest,
    languageAbility: filterState?.languageAbility,
    positionDuration: filterState?.positionDuration,
    locationPreferences: filterState?.locationPreferences,
    operationalRequirements: filterState?.operationalRequirements,
    skills: filterState?.skills,
    flexibleWorkLocations: filterState?.flexibleWorkLocations,
  };
}

export function transformFormValuesToCommunityInterestFilterInput(
  data: FormValues,
): CommunityInterestFilterInput {
  return {
    ...data,
    jobInterest: data.mobilityInterest.includes("jobInterest"),
    trainingInterest: data.mobilityInterest.includes("trainingInterest"),
    lateralMoveInterest: data.mobilityType.includes("lateralMoveInterest"),
    promotionMoveInterest: data.mobilityType.includes("promotionMoveInterest"),
    // NOTE: we do want to treat an empty string as unset
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    languageAbility: data.languageAbility || undefined,
    positionDuration: data.employmentDuration
      ? unpackMaybes([durationToEnumPositionDuration(data.employmentDuration)])
      : undefined,
  };
}

export function transformCommunityInterestFilterInputToFormValues(
  input: CommunityInterestFilterInput | undefined,
): FormValues {
  const positionDuration = input?.positionDuration;
  const mobilityInterest = [];
  if (input?.jobInterest) mobilityInterest.push("jobInterest");
  if (input?.trainingInterest) mobilityInterest.push("trainingInterest");

  const mobilityType = [];
  if (input?.lateralMoveInterest) mobilityType.push("lateralMoveInterest");
  if (input?.promotionMoveInterest) mobilityType.push("promotionMoveInterest");

  return {
    communities: unpackMaybes(input?.communities),
    workStreams: unpackMaybes(input?.workStreams),
    mobilityInterest,
    mobilityType,
    languageAbility: input?.languageAbility ?? "",
    employmentDuration: !positionDuration?.length
      ? ""
      : positionDuration.includes(PositionDuration.Temporary)
        ? EmploymentDuration.Term
        : EmploymentDuration.Indeterminate,
    locationPreferences: unpackMaybes(input?.locationPreferences),
    operationalRequirements: unpackMaybes(input?.operationalRequirements),
    skills: unpackMaybes(input?.skills),
    flexibleWorkLocations: unpackMaybes(input?.flexibleWorkLocations),
    classifications: unpackMaybes(input?.classifications),
  };
}

export function extractUserIdsFromSelectedRows(
  selectedRowIds: string[],
): string[] {
  const userIds = selectedRowIds.map((id) => id.split("userId#")[1]);
  return uniqueItems(userIds);
}
