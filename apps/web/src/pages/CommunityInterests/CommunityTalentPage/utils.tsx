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
import { commonMessages, EmploymentDuration } from "@gc-digital-talent/i18n";
import { uniqueItems, unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";
import { durationToEnumPositionDuration } from "~/utils/userUtils";

import { FormValues } from "./components/CommunityTalentFilterDialog";

export function transformSortStateToOrderByClause(
  sortingRules: SortingState,
  filterState?: CommunityInterestFilterInput,
): QueryCommunityInterestsPaginatedOrderByRelationOrderByClause {
  const columnMap = new Map<string, string>([
    ["createdAt", "created_at"],
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
    ["jobInterest", "trainingInterest", "createdAt"].includes(sortingRule.id)
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
    sortingRule?.id === "skillCount" &&
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

export function getClassificationSort(
  sortingState?: SortingState,
): Maybe<SortOrder> {
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
    flexibleWorkLocations: filterState?.flexibleWorkLocations,
  };
}

type ObjectValues<T> = T[keyof T];

export type TEmploymentDuration = ObjectValues<typeof EmploymentDuration>;

export function transformFormValuesToCommunityInterestFilterInput(
  data: FormValues,
): CommunityInterestFilterInput {
  return {
    ...data,
    jobInterest: data.mobilityInterest.includes("jobInterest"),
    trainingInterest: data.mobilityInterest.includes("trainingInterest"),
    lateralMoveInterest: data.mobilityType.includes("lateralMoveInterest"),
    promotionMoveInterest: data.mobilityType.includes("promotionMoveInterest"),
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
    languageAbility: input?.languageAbility ?? undefined,
    employmentDuration: !positionDuration?.length
      ? undefined
      : positionDuration.includes(PositionDuration.Temporary)
        ? EmploymentDuration.Term
        : EmploymentDuration.Indeterminate,
    locationPreferences: unpackMaybes(input?.locationPreferences),
    operationalRequirements: unpackMaybes(input?.operationalRequirements),
    skills: unpackMaybes(input?.skills),
    flexibleWorkLocations: unpackMaybes(input?.flexibleWorkLocations),
  };
}

export function removeDuplicateIds(ids: string[]): string[] {
  const userIds = ids.map((id) => id.split("-userId#")[1]);
  return uniqueItems(userIds);
}
