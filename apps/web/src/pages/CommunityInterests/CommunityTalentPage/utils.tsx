import type { SortingState } from "@tanstack/react-table";
import type { IntlShape } from "react-intl";
import type { JSX } from "react";

import type {
  QueryCommunityInterestsPaginatedOrderByRelationOrderByClause,
  QueryCommunityInterestsPaginatedOrderByUserColumn,
  CommunityInterestFilterInput,
  UserFilterInput,
  LocalizedString,
} from "@gc-digital-talent/graphql";
import {
  SortOrder,
  OrderByRelationWithColumnAggregateFunction,
  PositionDuration,
  CommunityReferralStatus,
} from "@gc-digital-talent/graphql";
import type { ChipProps } from "@gc-digital-talent/ui";
import { Chip } from "@gc-digital-talent/ui";
import { commonMessages, EmploymentDuration } from "@gc-digital-talent/i18n";
import { uniqueItems, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  DATE_FORMAT_LOCALIZED,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";

import { durationToEnumPositionDuration } from "~/utils/userUtils";
import { followUpDateOverdueInfo } from "~/utils/talentRequestUtils";
import cells from "~/components/Table/cells";

import type { FormValues } from "./components/CommunityTalentFilterDialog";

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
): SortOrder | null {
  const sortRule = sortingState?.find((rule) => rule.id === "classification");
  if (sortRule) {
    return sortRule.desc ? SortOrder.Desc : SortOrder.Asc;
  }
  return null;
}

const communityReferralStatusColor: Record<
  CommunityReferralStatus,
  ChipProps["color"]
> = {
  [CommunityReferralStatus.New]: "warning",
  [CommunityReferralStatus.Pending]: "secondary",
  [CommunityReferralStatus.AvailableForReferral]: "success",
  [CommunityReferralStatus.NotReferred]: "gray",
};

export const communityReferralStatusCell = (
  status: {
    value: CommunityReferralStatus;
    label?: LocalizedString | null;
  },
  intl: IntlShape,
): JSX.Element => (
  <Chip color={communityReferralStatusColor[status.value]}>
    {status.label?.localized ?? intl.formatMessage(commonMessages.notAvailable)}
  </Chip>
);

export const communityReferralFollowUpDateCell = (
  followUpDate: string | null | undefined,
  now: Date,
  intl: IntlShape,
): JSX.Element | string | null => {
  if (!followUpDate) return null;

  const { isOverdue, isDueToday, daysOverdue } = followUpDateOverdueInfo(
    parseDateTimeUtc(followUpDate),
    now,
  );

  return isOverdue || isDueToday ? (
    <Chip color="error">
      {isOverdue
        ? intl.formatMessage(commonMessages.overdueDate, { daysOverdue })
        : intl.formatMessage(commonMessages.dueToday)}
    </Chip>
  ) : (
    cells.date(followUpDate, intl, DATE_FORMAT_LOCALIZED)
  );
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
    referralStatuses: filterState?.referralStatuses,
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
    referralStatuses: unpackMaybes(input?.referralStatuses),
  };
}

export function transformToUserFilterInput(
  _filterState: CommunityInterestFilterInput | undefined,
  searchTerm: string | undefined,
  _searchType: string | undefined,
): UserFilterInput | undefined {
  if (!searchTerm) {
    return undefined;
  }

  const userFilter: UserFilterInput = {};

  userFilter.generalSearch = searchTerm;

  return userFilter;
}

export function extractUserIdsFromSelectedRows(
  selectedRowIds: string[],
): string[] {
  const userIds = selectedRowIds.map((id) => id.split("userId#")[1]);
  return uniqueItems(userIds);
}
