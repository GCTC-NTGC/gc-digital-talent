import { TargetRole, type EmployeeProfile } from "@gc-digital-talent/graphql";

type EmployeeProfileCareerObjectiveFragment = Pick<
  EmployeeProfile,
  | "careerObjectiveClassification"
  | "careerObjectiveTargetRole"
  | "careerObjectiveTargetRoleOther"
  | "careerObjectiveJobTitle"
  | "careerObjectiveCommunity"
  | "careerObjectiveCommunityOther"
  | "careerObjectiveWorkStreams"
  | "careerObjectiveDepartments"
  | "careerObjectiveAdditionalInformation"
  | "careerObjectiveIsCSuiteRole"
  | "careerObjectiveCSuiteRoleTitle"
>;

export function hasAllEmptyFields({
  careerObjectiveClassification,
  careerObjectiveTargetRole,
  careerObjectiveTargetRoleOther,
  careerObjectiveJobTitle,
  careerObjectiveCommunity,
  careerObjectiveCommunityOther,
  careerObjectiveWorkStreams,
  careerObjectiveDepartments,
  careerObjectiveAdditionalInformation,
  careerObjectiveIsCSuiteRole,
  careerObjectiveCSuiteRoleTitle,
}: EmployeeProfileCareerObjectiveFragment): boolean {
  return (
    !careerObjectiveClassification &&
    !careerObjectiveTargetRole &&
    !careerObjectiveTargetRoleOther &&
    !careerObjectiveJobTitle &&
    !careerObjectiveCommunity &&
    !careerObjectiveCommunityOther &&
    !(careerObjectiveWorkStreams?.length ?? 0 > 0) &&
    !(careerObjectiveDepartments?.length ?? 0 > 0) &&
    !careerObjectiveAdditionalInformation &&
    (careerObjectiveIsCSuiteRole === undefined ||
      careerObjectiveIsCSuiteRole === null) &&
    !careerObjectiveCSuiteRoleTitle
  );
}

export function hasAnyEmptyFields({
  careerObjectiveTargetRole,
  careerObjectiveTargetRoleOther,
  careerObjectiveCommunity,
  careerObjectiveCommunityOther,
  careerObjectiveIsCSuiteRole,
  careerObjectiveCSuiteRoleTitle,
}: EmployeeProfileCareerObjectiveFragment): boolean {
  return (
    !careerObjectiveTargetRole ||
    (careerObjectiveTargetRole?.value === TargetRole.Other &&
      !careerObjectiveTargetRoleOther) ||
    (!careerObjectiveCommunity?.id && !careerObjectiveCommunityOther) ||
    (!!careerObjectiveIsCSuiteRole && !careerObjectiveCSuiteRoleTitle)
  );
}

export function hasEmptyRequiredFields(
  _: EmployeeProfileCareerObjectiveFragment,
): boolean {
  // no required fields
  return false;
}
