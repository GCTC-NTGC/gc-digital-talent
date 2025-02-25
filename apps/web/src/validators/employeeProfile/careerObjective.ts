import { EmployeeProfile } from "@gc-digital-talent/graphql";

export function hasAllEmptyFields({
  careerObjectiveClassification,
  careerObjectiveTargetRole,
  careerObjectiveTargetRoleOther,
  careerObjectiveJobTitle,
  careerObjectiveCommunity,
  careerObjectiveWorkStreams,
  careerObjectiveDepartments,
  careerObjectiveAdditionalInformation,
}: Pick<
  EmployeeProfile,
  | "careerObjectiveClassification"
  | "careerObjectiveTargetRole"
  | "careerObjectiveTargetRoleOther"
  | "careerObjectiveJobTitle"
  | "careerObjectiveCommunity"
  | "careerObjectiveWorkStreams"
  | "careerObjectiveDepartments"
  | "careerObjectiveAdditionalInformation"
>): boolean {
  return (
    !careerObjectiveClassification &&
    !careerObjectiveTargetRole &&
    !careerObjectiveTargetRoleOther &&
    !careerObjectiveJobTitle &&
    !careerObjectiveCommunity &&
    !careerObjectiveWorkStreams &&
    !careerObjectiveDepartments &&
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
}: Pick<
  EmployeeProfile,
  | "careerObjectiveClassification"
  | "careerObjectiveTargetRole"
  | "careerObjectiveJobTitle"
  | "careerObjectiveCommunity"
  | "careerObjectiveWorkStreams"
  | "careerObjectiveDepartments"
  | "careerObjectiveAdditionalInformation"
>): boolean {
  return (
    !careerObjectiveClassification ||
    !careerObjectiveTargetRole ||
    !careerObjectiveJobTitle ||
    !careerObjectiveCommunity ||
    !careerObjectiveWorkStreams ||
    !careerObjectiveDepartments ||
    !careerObjectiveAdditionalInformation
  );
}
