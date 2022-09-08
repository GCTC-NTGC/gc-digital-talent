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
  if (selection === LanguageAbility.Bilingual) {
    return LanguageAbility.Bilingual;
  }
  if (selection === LanguageAbility.English) {
    return LanguageAbility.English;
  }
  if (selection === LanguageAbility.French) {
    return LanguageAbility.French;
  }
  return undefined;
}

export function stringToEnumLocation(
  selection: string,
): WorkRegion | undefined {
  if (selection === WorkRegion.Atlantic) {
    return WorkRegion.Atlantic;
  }
  if (selection === WorkRegion.BritishColumbia) {
    return WorkRegion.BritishColumbia;
  }
  if (selection === WorkRegion.NationalCapital) {
    return WorkRegion.NationalCapital;
  }
  if (selection === WorkRegion.North) {
    return WorkRegion.North;
  }
  if (selection === WorkRegion.Ontario) {
    return WorkRegion.Ontario;
  }
  if (selection === WorkRegion.Prairie) {
    return WorkRegion.Prairie;
  }
  if (selection === WorkRegion.Quebec) {
    return WorkRegion.Quebec;
  }
  if (selection === WorkRegion.Telework) {
    return WorkRegion.Telework;
  }
  return undefined;
}

export function stringToEnumOperational(
  selection: string,
): OperationalRequirement | undefined {
  if (selection === OperationalRequirement.DriversLicense) {
    return OperationalRequirement.DriversLicense;
  }
  if (selection === OperationalRequirement.OnCall) {
    return OperationalRequirement.OnCall;
  }
  if (selection === OperationalRequirement.OvertimeOccasional) {
    return OperationalRequirement.OvertimeOccasional;
  }
  if (selection === OperationalRequirement.OvertimeRegular) {
    return OperationalRequirement.OvertimeRegular;
  }
  if (selection === OperationalRequirement.OvertimeScheduled) {
    return OperationalRequirement.OvertimeScheduled;
  }
  if (selection === OperationalRequirement.OvertimeShortNotice) {
    return OperationalRequirement.OvertimeShortNotice;
  }
  if (selection === OperationalRequirement.ShiftWork) {
    return OperationalRequirement.ShiftWork;
  }
  if (selection === OperationalRequirement.TransportEquipment) {
    return OperationalRequirement.TransportEquipment;
  }
  if (selection === OperationalRequirement.Travel) {
    return OperationalRequirement.Travel;
  }
  if (selection === OperationalRequirement.WorkWeekends) {
    return OperationalRequirement.WorkWeekends;
  }
  return undefined;
}

export function stringToEnumJobLooking(
  selection: string,
): JobLookingStatus | undefined {
  if (selection === JobLookingStatus.ActivelyLooking) {
    return JobLookingStatus.ActivelyLooking;
  }
  if (selection === JobLookingStatus.Inactive) {
    return JobLookingStatus.Inactive;
  }
  if (selection === JobLookingStatus.OpenToOpportunities) {
    return JobLookingStatus.OpenToOpportunities;
  }
  return undefined;
}
