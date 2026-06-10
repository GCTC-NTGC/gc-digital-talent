import type { SortingState } from "@tanstack/react-table";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import type {
  AdvancedOrderByInput,
  LocalizedTalentRequestTrackedUserNotReferredReason,
  LocalizedTalentRequestTrackedUserNotSelectedReason,
  TalentRequestTrackedUserFilterInput,
} from "@gc-digital-talent/graphql";
import {
  SortOrder,
  TalentRequestTrackedUserStatus,
} from "@gc-digital-talent/graphql";
import type { ChipProps } from "@gc-digital-talent/ui";

export interface FormValues {
  status?: string[];
}

export type TrackedUserFilters = Pick<
  TalentRequestTrackedUserFilterInput,
  "statuses"
>;

const statusValues = Object.values(TalentRequestTrackedUserStatus);

export function transformFormValuesToFilterInput(
  data: FormValues,
): TrackedUserFilters {
  const selected = data.status ?? [];
  const statuses = statusValues.filter((value) => selected.includes(value));

  return {
    statuses: statuses.length ? statuses : undefined,
  };
}

export function transformFilterInputToFormValues(
  input: TrackedUserFilters | undefined,
): FormValues {
  return {
    status: unpackMaybes(input?.statuses),
  };
}

export function transformToWhere(
  filters: TrackedUserFilters | undefined,
  searchTerm: string | undefined,
): TalentRequestTrackedUserFilterInput {
  return {
    statuses: filters?.statuses,
    generalSearch: searchTerm?.length ? searchTerm : undefined,
  };
}

export function transformSortStateToOrderByClause(
  sortingRule: SortingState | undefined,
): AdvancedOrderByInput[] | undefined {
  const rule = sortingRule?.find(({ id }) => id === "skillCount");
  if (!rule) return undefined;

  // skill_count is a select-alias subquery, so order via the model scope rather than a column
  return [
    {
      scope: "orderBySkillCount",
      direction: rule.desc ? SortOrder.Desc : SortOrder.Asc,
    },
  ];
}

/** Chip colour for a tracked user's status (the status itself is computed on the API). */
export function trackedUserStatusChipColor(
  status: TalentRequestTrackedUserStatus | null | undefined,
): ChipProps["color"] {
  switch (status) {
    case TalentRequestTrackedUserStatus.Referred:
    case TalentRequestTrackedUserStatus.Selected:
      return "success";
    case TalentRequestTrackedUserStatus.NotReferred:
    case TalentRequestTrackedUserStatus.NotSelected:
      return "error";
    default:
      return "gray";
  }
}

export function trackedUserReason(
  notReferredReason?: LocalizedTalentRequestTrackedUserNotReferredReason | null,
  notSelectedReason?: LocalizedTalentRequestTrackedUserNotSelectedReason | null,
): string | null {
  return (notSelectedReason ?? notReferredReason)?.label?.localized ?? null;
}
