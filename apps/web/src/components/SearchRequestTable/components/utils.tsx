import mapValues from "lodash/mapValues";
import { useIntl } from "react-intl";
import { OperationContext } from "urql";
import { SortingState } from "@tanstack/react-table";

import {
  getPoolStream,
  getLocalizedName,
  getPoolCandidateSearchStatus,
} from "@gc-digital-talent/i18n";
import { enumToOptions } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  PoolStream,
  PoolCandidateSearchStatus,
  useGetFilterDataForRequestsQuery,
  PoolCandidateSearchRequestInput,
  OrderByClause,
  SortOrder,
} from "@gc-digital-talent/graphql";

import {
  stringToEnumRequestStatus,
  stringToEnumStream,
} from "~/utils/requestUtils";

export type FormValues = {
  status?: string[];
  departments?: string[];
  classifications?: string[];
  streams?: string[];
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["Classification", "Department"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first",
};

export default function useFilterOptions() {
  const intl = useIntl();
  const [filterRes] = useGetFilterDataForRequestsQuery({ context });

  const optionsData = {
    status: enumToOptions(PoolCandidateSearchStatus, [
      PoolCandidateSearchStatus.New,
      PoolCandidateSearchStatus.InProgress,
      PoolCandidateSearchStatus.Waiting,
      PoolCandidateSearchStatus.Done,
      PoolCandidateSearchStatus.DoneNoCandidates,
    ]).map(({ value }) => ({
      value,
      label: intl.formatMessage(getPoolCandidateSearchStatus(value)),
    })),
    departments: filterRes?.data?.departments
      ?.filter(notEmpty)
      .map((department) => ({
        value: department.id,
        label: getLocalizedName(department.name, intl),
      })),
    classifications: filterRes.data?.classifications
      ?.filter(notEmpty)
      .map((classification) => ({
        value: classification.id,
        label: `${classification.group}-0${classification.level}`,
      })),
    streams: enumToOptions(PoolStream).map(({ value }) => ({
      value,
      label: intl.formatMessage(getPoolStream(value)),
    })),
  };

  // Creates an object keyed with all fields, each with empty array.
  // Unlike Array.prototype.reduce(), creates clear type. Used for defaults.
  const emptyFormValues = mapValues(optionsData, () => []);

  return {
    optionsData,
    emptyFormValues,
    rawGraphqlResults: {
      departments: filterRes,
      classifications: filterRes,
    },
  };
}

export function transformFormValuesToSearchRequestFilterInput(
  data: FormValues,
): PoolCandidateSearchRequestInput {
  return {
    status: data.status?.length
      ? data.status.map(stringToEnumRequestStatus)
      : undefined,
    departments: data.departments?.length ? data.departments : undefined,
    classifications: data.classifications?.length
      ? data.classifications
      : undefined,
    streams: data.streams?.length
      ? data.streams.map(stringToEnumStream)
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
    ["status", "request_status"],
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
    streams: input?.streams?.filter(notEmpty) ?? [],
  };
}
