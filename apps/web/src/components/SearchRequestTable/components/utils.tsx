import { SortingState } from "@tanstack/react-table";

import { notEmpty } from "@gc-digital-talent/helpers";
import {
  PoolCandidateSearchRequestInput,
  OrderByClause,
  SortOrder,
} from "@gc-digital-talent/graphql";

import { stringToEnumRequestStatus } from "~/utils/requestUtils";

export interface FormValues {
  status?: string[];
  departments?: string[];
  classifications?: string[];
  workStreams?: string[];
}

export function transformFormValuesToSearchRequestFilterInput(
  data: FormValues,
): PoolCandidateSearchRequestInput {
  return {
    status: data.status?.length
      ? data.status.map(stringToEnumRequestStatus).filter(notEmpty)
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
    ["status", "request_status_weight"],
    ["requestedDate", "created_at"],
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
    status: input?.status?.filter(notEmpty) ?? [],
    departments: input?.departments?.filter(notEmpty) ?? [],
    classifications: input?.classifications?.filter(notEmpty) ?? [],
    workStreams: input?.workStreams?.filter(notEmpty) ?? [],
  };
}
