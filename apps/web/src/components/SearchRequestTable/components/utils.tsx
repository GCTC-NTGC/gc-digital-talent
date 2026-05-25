import type { SortingState } from "@tanstack/react-table";

import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import type {
  PoolCandidateSearchRequestInput,
  OrderByClause,
  TalentRequestStatus,
} from "@gc-digital-talent/graphql";
import { SortOrder } from "@gc-digital-talent/graphql";

export interface FormValues {
  status?: TalentRequestStatus[];
  departments?: string[];
  classifications?: string[];
  workStreams?: string[];
}

export function transformFormValuesToSearchRequestFilterInput(
  data: FormValues,
): PoolCandidateSearchRequestInput {
  return {
    talentRequestStatus: data.status?.length
      ? unpackMaybes(data.status)
      : undefined,
    departments: data.departments?.length ? data.departments : undefined,
    classifications: data.classifications?.length
      ? data.classifications
      : undefined,
    workStreams: data.workStreams?.length
      ? data.workStreams.filter(notEmpty)
      : undefined,
  };
}

export function transformSortStateToOrderByClause(
  sortingRule: SortingState,
): OrderByClause | OrderByClause[] | undefined {
  const columnMap = new Map<string, string>([
    ["id", "id"],
    ["manager", "full_name"],
    ["jobTitle", "job_title"],
    ["email", "email"],
    ["status", "status_weight"],
    ["requestedDate", "created_at"],
    ["followUpDate", "follow_up_date"],
  ]);

  const orderBy = sortingRule
    .map((rule) => {
      const columnName = columnMap.get(rule.id);
      if (!columnName) return undefined;
      return {
        column: columnName,
        order: rule.desc ? SortOrder.Desc : SortOrder.Asc,
      };
    })
    .filter(notEmpty);

  return orderBy.length ? orderBy : undefined;
}

export function transformSearchRequestFilterInputToFormValues(
  input: PoolCandidateSearchRequestInput | undefined,
): FormValues {
  return {
    status: unpackMaybes(input?.talentRequestStatus),
    departments: input?.departments?.filter(notEmpty) ?? [],
    classifications: input?.classifications?.filter(notEmpty) ?? [],
    workStreams: input?.workStreams?.filter(notEmpty) ?? [],
  };
}
