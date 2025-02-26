import { EmployeeProfile } from "@gc-digital-talent/graphql";

type EmployeeProfileCareerObjectiveFragment = Pick<
  EmployeeProfile,
  | "careerObjectiveClassification"
  | "careerObjectiveTargetRole"
  | "careerObjectiveTargetRoleOther"
  | "careerObjectiveJobTitle"
  | "careerObjectiveCommunity"
  | "careerObjectiveWorkStreams"
  | "careerObjectiveDepartments"
  | "careerObjectiveAdditionalInformation"
>;

export function hasAllEmptyFields({
  careerObjectiveClassification,
  careerObjectiveTargetRole,
  careerObjectiveTargetRoleOther,
  careerObjectiveJobTitle,
  careerObjectiveCommunity,
  careerObjectiveWorkStreams,
  careerObjectiveDepartments,
  careerObjectiveAdditionalInformation,
}: EmployeeProfileCareerObjectiveFragment): boolean {
  return (
    !careerObjectiveClassification &&
    !careerObjectiveTargetRole &&
    !careerObjectiveTargetRoleOther &&
    !careerObjectiveJobTitle &&
    !careerObjectiveCommunity &&
    !(careerObjectiveWorkStreams?.length ?? 0 > 0) &&
    !(careerObjectiveDepartments?.length ?? 0 > 0) &&
    !careerObjectiveAdditionalInformation
  );
}

export function hasAnyEmptyFields({
  careerObjectiveClassification,
  careerObjectiveTargetRole,
  careerObjectiveJobTitle,
  careerObjectiveCommunity,
  careerObjectiveWorkStreams,
  careerObjectiveDepartments,
  careerObjectiveAdditionalInformation,
}: EmployeeProfileCareerObjectiveFragment): boolean {
  return (
    !careerObjectiveClassification ||
    !careerObjectiveTargetRole ||
    !careerObjectiveJobTitle ||
    !careerObjectiveCommunity ||
    ((careerObjectiveCommunity.workStreams?.length ?? 0 > 0) &&
      !(careerObjectiveWorkStreams?.length ?? 0 > 0)) ||
    !(careerObjectiveDepartments?.length ?? 0 > 0) ||
    !careerObjectiveAdditionalInformation
  );
}

export function hasEmptyRequiredFields(
  _: EmployeeProfileCareerObjectiveFragment,
): boolean {
  // no required fields
  return false;
}
