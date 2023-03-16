import {
  CandidateExpiryFilter,
  JobLookingStatus,
  LanguageAbility,
  OperationalRequirement,
  PoolCandidateStatus,
  PositionDuration,
  WorkRegion,
} from "~/api/generated";

// convert string type to Enum types for various selections
export function stringToEnumLanguage(
  selection: string,
): LanguageAbility | undefined {
  if (Object.values(LanguageAbility).includes(selection as LanguageAbility)) {
    return selection as LanguageAbility;
  }
  return undefined;
}

export function stringToEnumLocation(
  selection: string,
): WorkRegion | undefined {
  if (Object.values(WorkRegion).includes(selection as WorkRegion)) {
    return selection as WorkRegion;
  }
  return undefined;
}

export function stringToEnumOperational(
  selection: string,
): OperationalRequirement | undefined {
  if (
    Object.values(OperationalRequirement).includes(
      selection as OperationalRequirement,
    )
  ) {
    return selection as OperationalRequirement;
  }
  return undefined;
}

export function stringToEnumJobLooking(
  selection: string,
): JobLookingStatus | undefined {
  if (Object.values(JobLookingStatus).includes(selection as JobLookingStatus)) {
    return selection as JobLookingStatus;
  }
  return undefined;
}

export function stringToEnumPoolCandidateStatus(
  selection: string,
): PoolCandidateStatus | undefined {
  if (
    Object.values(PoolCandidateStatus).includes(
      selection as PoolCandidateStatus,
    )
  ) {
    return selection as PoolCandidateStatus;
  }
  return undefined;
}

export function stringToEnumCandidateExpiry(
  selection: string,
): CandidateExpiryFilter | undefined {
  if (
    Object.values(CandidateExpiryFilter).includes(
      selection as CandidateExpiryFilter,
    )
  ) {
    return selection as CandidateExpiryFilter;
  }
  return undefined;
}

// options on copy are TERM or INDETERMINATE
export function durationToEnumPositionDuration(
  selection: string,
): PositionDuration | undefined {
  if (selection === "TERM") {
    return PositionDuration.Temporary;
  }
  if (selection === "INDETERMINATE") {
    return PositionDuration.Permanent;
  }
  return undefined;
}
