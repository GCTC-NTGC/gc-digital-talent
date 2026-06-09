import type { SortingState } from "@tanstack/react-table";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import type {
  AdvancedOrderByInput,
  LocalizedTalentRequestTrackedUserNotReferredReason,
  LocalizedTalentRequestTrackedUserNotSelectedReason,
  LocalizedTalentRequestTrackedUserReferralDecision,
  LocalizedTalentRequestTrackedUserSelectionDecision,
  TalentRequestTrackedUserFilterInput,
} from "@gc-digital-talent/graphql";
import {
  SortOrder,
  TalentRequestTrackedUserReferralDecision,
  TalentRequestTrackedUserSelectionDecision,
} from "@gc-digital-talent/graphql";
import type { ChipProps } from "@gc-digital-talent/ui";

export interface FormValues {
  status?: string[];
}

export type TrackedUserFilters = Pick<
  TalentRequestTrackedUserFilterInput,
  "referralDecisions" | "selectionDecisions"
>;

const referralValues = Object.values(TalentRequestTrackedUserReferralDecision);
const selectionValues = Object.values(
  TalentRequestTrackedUserSelectionDecision,
);

export function transformFormValuesToFilterInput(
  data: FormValues,
): TrackedUserFilters {
  const statuses = data.status ?? [];
  const referralDecisions = referralValues.filter((value) =>
    statuses.includes(value),
  );
  const selectionDecisions = selectionValues.filter((value) =>
    statuses.includes(value),
  );

  return {
    referralDecisions: referralDecisions.length ? referralDecisions : undefined,
    selectionDecisions: selectionDecisions.length
      ? selectionDecisions
      : undefined,
  };
}

export function transformFilterInputToFormValues(
  input: TrackedUserFilters | undefined,
): FormValues {
  return {
    status: [
      ...unpackMaybes(input?.referralDecisions),
      ...unpackMaybes(input?.selectionDecisions),
    ],
  };
}

export function transformToWhere(
  filters: TrackedUserFilters | undefined,
  searchTerm: string | undefined,
): TalentRequestTrackedUserFilterInput {
  return {
    referralDecisions: filters?.referralDecisions,
    selectionDecisions: filters?.selectionDecisions,
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

interface StatusChip {
  label?: string | null;
  color: ChipProps["color"];
}

/** Derive a single status chip, with selection taking precedence over referral. */
export function trackedUserStatusChip(
  referralDecision?: LocalizedTalentRequestTrackedUserReferralDecision | null,
  selectionDecision?: LocalizedTalentRequestTrackedUserSelectionDecision | null,
): StatusChip {
  if (selectionDecision) {
    return {
      label: selectionDecision.label?.localized,
      color:
        selectionDecision.value ===
        TalentRequestTrackedUserSelectionDecision.Selected
          ? "success"
          : "error",
    };
  }

  if (referralDecision) {
    return {
      label: referralDecision.label?.localized,
      color:
        referralDecision.value ===
        TalentRequestTrackedUserReferralDecision.Referred
          ? "success"
          : "error",
    };
  }

  return { color: "gray" };
}

export function trackedUserReason(
  notReferredReason?: LocalizedTalentRequestTrackedUserNotReferredReason | null,
  notSelectedReason?: LocalizedTalentRequestTrackedUserNotSelectedReason | null,
): string | null {
  return (notSelectedReason ?? notReferredReason)?.label?.localized ?? null;
}
