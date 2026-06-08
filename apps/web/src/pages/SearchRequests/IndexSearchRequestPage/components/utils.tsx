import type { SortingState } from "@tanstack/react-table";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import type {
  AdvancedOrderByInput,
  TalentRequestStatus,
  TalentRequestInput,
} from "@gc-digital-talent/graphql";
import { SortOrder } from "@gc-digital-talent/graphql";

export interface FormValues {
  status?: TalentRequestStatus[];
  departments?: string[];
  classifications?: string[];
  workStreams?: string[];
}

export function transformFormValuesToTalentRequestFilterInput(
  data: FormValues,
): TalentRequestInput {
  return {
    talentRequestStatus: data.status?.length
      ? unpackMaybes(data.status)
      : undefined,
    departments: data.departments?.length ? data.departments : undefined,
    classifications: data.classifications?.length
      ? data.classifications
      : undefined,
    workStreams: data.workStreams?.length
      ? unpackMaybes(data.workStreams)
      : undefined,
  };
}

export function transformSortStateToOrderByClause(
  sortingRule: SortingState,
): AdvancedOrderByInput | AdvancedOrderByInput[] | undefined {
  const columnMap = new Map<string, string>([
    ["id", "id"],
    ["manager", "full_name"],
    ["jobTitle", "job_title"],
    ["email", "email"],
    ["status", "status_weight"],
    ["requestedDate", "created_at"],
    ["followUpDate", "follow_up_date"],
  ]);

  const orderBy = sortingRule.map((rule) => {
    const columnName = columnMap.get(rule.id);
    if (!columnName) return undefined;
    return {
      column: columnName,
      direction: rule.desc ? SortOrder.Desc : SortOrder.Asc,
    };
  });

  return orderBy.length ? unpackMaybes(orderBy) : undefined;
}

export function transformTalentRequestFilterInputToFormValues(
  input: TalentRequestInput | undefined,
): FormValues {
  return {
    status: unpackMaybes(input?.talentRequestStatus),
    departments: unpackMaybes(input?.departments) ?? [],
    classifications: unpackMaybes(input?.classifications) ?? [],
    workStreams: unpackMaybes(input?.workStreams) ?? [],
  };
}

export const transformTalentRequestInput = (
  filterState: TalentRequestInput,
  searchBarTerm: string | undefined,
  searchType: string | undefined,
): TalentRequestInput | null => {
  if (
    filterState === undefined &&
    searchBarTerm === undefined &&
    searchType === undefined
  ) {
    return null;
  }

  return {
    // from search bar
    generalSearch: !!searchBarTerm && !searchType ? searchBarTerm : undefined,
    id: searchType === "id" && !!searchBarTerm ? searchBarTerm : undefined,
    fullName:
      searchType === "fullName" && !!searchBarTerm ? searchBarTerm : undefined,
    email:
      searchType === "email" && !!searchBarTerm ? searchBarTerm : undefined,
    jobTitle:
      searchType === "jobTitle" && !!searchBarTerm ? searchBarTerm : undefined,
    additionalComments:
      searchType === "additionalComments" && !!searchBarTerm
        ? searchBarTerm
        : undefined,
    adminNotes:
      searchType === "adminNotes" && !!searchBarTerm
        ? searchBarTerm
        : undefined,
    // from filter
    talentRequestStatus: filterState?.talentRequestStatus,
    departments: filterState?.departments,
    classifications: filterState?.classifications,
    workStreams: filterState?.workStreams,
  };
};
