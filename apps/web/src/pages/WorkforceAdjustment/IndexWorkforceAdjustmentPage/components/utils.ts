import {
  EmployeeWfaFilterInput,
  IdInput,
  InputMaybe,
  PositionDuration,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { SearchState } from "~/components/Table/ResponsiveTable/types";

import { FormValues } from "./WorkforceAdjustmentFilterDialog";

function arrayToIdInput(arr?: string[]): IdInput[] {
  return arr?.map((id) => ({ id })) ?? [];
}

export function transformFormValuesToEmployeeWFAFilterInput(
  data: FormValues,
): EmployeeWfaFilterInput {
  return {
    classifications: arrayToIdInput(data.classifications),
    departments: arrayToIdInput(data.departments),
    workStreams: arrayToIdInput(data.workStreams),
    skills: arrayToIdInput(data.skills),

    wfaInterests: data.wfaInterests,
    languageAbility: data.languageAbility,
    positionDuration: data.positionDuration
      ? [data.positionDuration]
      : undefined,
    operationalRequirements: data.operationalRequirements,
    locationPreferences: data.workRegions,

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

  return {
    classifications: flattenIdInput(data?.classifications),
    departments: flattenIdInput(data?.departments),
    workStreams: flattenIdInput(data?.workStreams),
    skills: flattenIdInput(data?.skills),

    wfaInterests: unpackMaybes(data?.wfaInterests),
    languageAbility: data?.languageAbility ?? undefined,
    positionDuration: !positionDuration?.length
      ? undefined
      : positionDuration.includes(PositionDuration.Temporary)
        ? PositionDuration.Temporary
        : PositionDuration.Permanent,
    operationalRequirements: unpackMaybes(data?.operationalRequirements),
    workRegions: unpackMaybes(data?.locationPreferences),

    equity,
  };
}

export function transformStateToWhereClause(
  filterState: EmployeeWfaFilterInput | undefined,
  searchState: SearchState | undefined,
): InputMaybe<EmployeeWfaFilterInput> | undefined {
  console.log({ searchState });
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
