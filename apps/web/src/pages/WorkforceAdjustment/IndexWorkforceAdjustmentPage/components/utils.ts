import { SortingState } from "@tanstack/react-table";

import {
  EmployeeWfaFilterInput,
  IdInput,
  InputMaybe,
  OrderByRelationWithColumnAggregateFunction,
  PositionDuration,
  QueryEmployeeWfaPaginatedAdminTableOrderByCurrentClassificationColumn,
  QueryEmployeeWfaPaginatedAdminTableOrderByRelationOrderByClause,
  SortOrder,
} from "@gc-digital-talent/graphql";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";

import { SearchState } from "~/components/Table/ResponsiveTable/types";

import { FormValues } from "./WorkforceAdjustmentFilterDialog";

export type HasPriorityEntitlementValue = "yes" | "no" | "both";

function arrayToIdInput(arr?: string[]): IdInput[] {
  return arr?.map((id) => ({ id })) ?? [];
}

export function transformFormValuesToEmployeeWFAFilterInput(
  data: FormValues,
): EmployeeWfaFilterInput {
  let hasPriorityEntitlement: boolean | undefined;
  if (data.hasPriorityEntitlement !== "both") {
    hasPriorityEntitlement = data.hasPriorityEntitlement === "yes";
  }

  return {
    classifications: arrayToIdInput(data.classifications),
    departments: arrayToIdInput(data.departments),
    workStreams: arrayToIdInput(data.workStreams),
    skills: arrayToIdInput(data.skills),
    communities: arrayToIdInput(data.communities),

    wfaInterests: data.wfaInterests,
    languageAbility: data.languageAbility,
    positionDuration: data.positionDuration
      ? [data.positionDuration]
      : undefined,
    operationalRequirements: data.operationalRequirements,
    locationPreferences: data.workRegions,
    flexibleWorkLocations: data.flexibleWorkLocations,
    hasPriorityEntitlement,

    equity: {
      ...(data.equity?.includes("isWoman") && { isWoman: true }),
      ...(data.equity?.includes("hasDisability") && { hasDisability: true }),
      ...(data.equity?.includes("isIndigenous") && { isIndigenous: true }),
      ...(data.equity?.includes("isVisibleMinority") && {
        isVisibleMinority: true,
      }),
    },
  };
}

function flattenIdInput(input?: InputMaybe<InputMaybe<IdInput>[]>): string[] {
  return unpackMaybes(input).map(({ id }) => id);
}

export function transformEmployeeWFAFilterInputToFormValues(
  data?: EmployeeWfaFilterInput,
): FormValues {
  const positionDuration = data?.positionDuration;
  let equity: FormValues["equity"] = [];
  if (data?.equity?.isWoman) {
    equity = [...equity, "isWoman"];
  }
  if (data?.equity?.isVisibleMinority) {
    equity = [...equity, "isVisibleMinority"];
  }
  if (data?.equity?.isIndigenous) {
    equity = [...equity, "isIndigenous"];
  }
  if (data?.equity?.hasDisability) {
    equity = [...equity, "hasDisability"];
  }

  let hasPriorityEntitlement: HasPriorityEntitlementValue = "both";
  if (typeof data?.hasPriorityEntitlement !== "undefined") {
    hasPriorityEntitlement = data.hasPriorityEntitlement ? "yes" : "no";
  }

  return {
    classifications: flattenIdInput(data?.classifications),
    departments: flattenIdInput(data?.departments),
    workStreams: flattenIdInput(data?.workStreams),
    skills: flattenIdInput(data?.skills),
    communities: flattenIdInput(data?.communities),

    wfaInterests: unpackMaybes(data?.wfaInterests),
    languageAbility: data?.languageAbility ?? undefined,
    positionDuration: !positionDuration?.length
      ? undefined
      : positionDuration.includes(PositionDuration.Temporary)
        ? PositionDuration.Temporary
        : PositionDuration.Permanent,
    operationalRequirements: unpackMaybes(data?.operationalRequirements),
    flexibleWorkLocations: unpackMaybes(data?.flexibleWorkLocations),
    workRegions: unpackMaybes(data?.locationPreferences),

    equity,
    hasPriorityEntitlement,
  };
}

export function transformStateToWhereClause(
  filterState: EmployeeWfaFilterInput | undefined,
  searchState: SearchState | undefined,
): InputMaybe<EmployeeWfaFilterInput> | undefined {
  if (
    typeof filterState === "undefined" &&
    typeof searchState?.term === "undefined" &&
    typeof searchState?.type === "undefined"
  ) {
    return undefined;
  }

  return {
    generalSearch:
      searchState?.term && !searchState.type ? searchState.term : undefined,
    ...filterState,
  };
}

export function transformSortStateToOrderByClause(
  sortState: SortingState,
):
  | QueryEmployeeWfaPaginatedAdminTableOrderByRelationOrderByClause[]
  | undefined {
  const columnMap = new Map<string, string>([
    ["name", "first_name"],
    ["preferredLang", "preferred_lang"],
    ["wfaInterest", "wfa_interest"],
    ["workEmail", "work_email"],
    ["wfaUpdatedAt", "wfa_updated_at"],
    ["wfaDate", "wfa_date"],
    ["hasPriorityEntitlement", "has_priority_entitlement"],

    // Relations
    ["classification", "classification"],
  ]);

  const sortingRule = sortState?.find((rule) => {
    const columnName = columnMap.get(rule.id);
    return !!columnName;
  });

  if (sortingRule && sortingRule.id === "classification") {
    return [
      {
        column: undefined,
        order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
        currentClassification: {
          aggregate: OrderByRelationWithColumnAggregateFunction.Max,
          column:
            QueryEmployeeWfaPaginatedAdminTableOrderByCurrentClassificationColumn.Group,
        },
      },
      {
        column: undefined,
        order: sortingRule.desc ? SortOrder.Desc : SortOrder.Asc,
        currentClassification: {
          aggregate: OrderByRelationWithColumnAggregateFunction.Max,
          column:
            QueryEmployeeWfaPaginatedAdminTableOrderByCurrentClassificationColumn.Level,
        },
      },
    ];
  }

  const orderBy = sortState
    ?.map((rule) => {
      const columnName = columnMap.get(rule.id);
      if (!columnName) return undefined;
      return {
        column: columnName,
        order: rule.desc ? SortOrder.Desc : SortOrder.Asc,
      };
    })
    .filter(notEmpty);

  return orderBy?.length ? orderBy : undefined;
}
