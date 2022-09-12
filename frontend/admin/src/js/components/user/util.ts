import {
  JobLookingStatus,
  LanguageAbility,
  OperationalRequirement,
  WorkRegion,
} from "../../api/generated";

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
