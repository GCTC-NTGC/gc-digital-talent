import { SortingState } from "@tanstack/react-table";
import { IntlShape } from "react-intl";
import { JSX } from "react";

import {
  Maybe,
  SortOrder,
  QueryCommunityInterestsPaginatedOrderByRelationOrderByClause,
  OrderByRelationWithColumnAggregateFunction,
  QueryCommunityInterestsPaginatedOrderByUserColumn,
  CommunityInterestFilterInput,
  InputMaybe,
  PositionDuration,
} from "@gc-digital-talent/graphql";
import { Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { notEmpty, uniqueItems } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";
import {
  durationToEnumPositionDuration,
  stringToEnumLanguage,
  stringToEnumLocation,
  stringToEnumOperational,
} from "~/utils/userUtils";

import { FormValues } from "./components/CommunityTalentFilterDialog";

export function transformSortStateToOrderByClause(
  sortingRules: SortingState,
  filterState?: CommunityInterestFilterInput,
): QueryCommunityInterestsPaginatedOrderByRelationOrderByClause {
  const columnMap = new Map<string, string>([
    ["jobInterest", "job_interest"],
    ["trainingInterest", "training_interest"],
    ["userName", "FIRST_NAME"],
    ["workEmail", "WORK_EMAIL"],
    ["preferredLang", "PREFERRED_LANG"],
    ["skillCount", "skill_count"],
  ]);

  const sortingRule = sortingRules?.find((rule) => {
    const columnName = columnMap.get(rule.id);
    return !!columnName;
  });

  if (
    sortingRule &&
    ["jobInterest", "trainingInterest"].includes(sortingRule.id)
  ) {
    const columnName = columnMap.get(sortingRule.id);
    return {
      column: columnName,
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      user: undefined,
    };
  }

  if (
    sortingRule &&
    ["userName", "preferredLang", "workEmail"].includes(sortingRule.id)
  ) {
    const columnName = columnMap.get(sortingRule.id);
    return {
      column: undefined,
      order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
      user: {
        aggregate: OrderByRelationWithColumnAggregateFunction.Max,
        column: columnName as QueryCommunityInterestsPaginatedOrderByUserColumn,
      },
    };
  }

  if (
    sortingRule &&
    sortingRule.id === "skillCount" &&
    filterState?.skills &&
    filterState.skills.length > 0
  ) {
    return {
      column: "skill_count",
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
      column: "FIRST_NAME" as QueryCommunityInterestsPaginatedOrderByUserColumn,
    },
  };
}

export const usernameCell = (
  userId: string,
  paths: ReturnType<typeof useRoutes>,
  intl: IntlShape,
  firstName?: Maybe<string>,
  lastName?: Maybe<string>,
): JSX.Element => {
  const userName = getFullNameLabel(firstName, lastName, intl);
  return <Link href={paths.userEmployeeProfile(userId)}>{userName}</Link>;
};

export function classificationAccessor(
  classificationGroup?: string,
  classificationLevel?: number,
): string {
  return classificationGroup && classificationLevel
    ? `${classificationGroup}-${classificationLevel < 10 ? "0" : ""}${classificationLevel}`
    : "";
}

export function interestAccessor(
  intl: IntlShape,
  interest?: Maybe<boolean>,
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
): InputMaybe<CommunityInterestFilterInput> | undefined {
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
  };
}

export function transformFormValuesToCommunityInterestFilterInput(
  data: FormValues,
): CommunityInterestFilterInput {
  return {
    communities: data.communities.map((id) => id),
    workStreams: data.workStreams.map((id) => id),
    jobInterest: data.mobilityInterest.includes("jobInterest"),
    trainingInterest: data.mobilityInterest.includes("trainingInterest"),
    lateralMoveInterest: data.mobilityType.includes("lateralMoveInterest"),
    promotionMoveInterest: data.mobilityType.includes("promotionMoveInterest"),
    languageAbility: data.languageAbility
      ? stringToEnumLanguage(data.languageAbility)
      : undefined,
    positionDuration: data.employmentDuration
      ? [durationToEnumPositionDuration(data.employmentDuration)].filter(
          notEmpty,
        )
      : undefined,
    locationPreferences: data.workRegions
      .map((region) => {
        return stringToEnumLocation(region);
      })
      .filter(notEmpty),
    operationalRequirements: data.operationalRequirements
      .map((requirement) => {
        return stringToEnumOperational(requirement);
      })
      .filter(notEmpty),
    skills: data.skills.map((id) => id),
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
    communities: input?.communities?.filter(notEmpty).map((id) => id) ?? [],
    workStreams: input?.workStreams?.filter(notEmpty).map((id) => id) ?? [],
    mobilityInterest,
    mobilityType,
    languageAbility: input?.languageAbility ?? "",
    employmentDuration: !positionDuration?.length
      ? ""
      : positionDuration.includes(PositionDuration.Temporary)
        ? "TERM"
        : "INDETERMINATE",
    workRegions: input?.locationPreferences?.filter(notEmpty) ?? [],
    operationalRequirements:
      input?.operationalRequirements?.filter(notEmpty) ?? [],
    skills: input?.skills?.filter(notEmpty).map((id) => id) ?? [],
  };
}

export function removeDuplicateIds(ids: string[]): string[] {
  const userIds = ids.map((id) => id.split("-userId#")[1]);
  return uniqueItems(userIds);
}
