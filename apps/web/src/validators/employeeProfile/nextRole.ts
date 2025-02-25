import { EmployeeProfile } from "@gc-digital-talent/graphql";

export function hasAllEmptyFields({
  nextRoleClassification,
  nextRoleTargetRole,
  nextRoleTargetRoleOther,
  nextRoleJobTitle,
  nextRoleCommunity,
  nextRoleWorkStreams,
  nextRoleDepartments,
  nextRoleAdditionalInformation,
}: Pick<
  EmployeeProfile,
  | "nextRoleClassification"
  | "nextRoleTargetRole"
  | "nextRoleTargetRoleOther"
  | "nextRoleJobTitle"
  | "nextRoleCommunity"
  | "nextRoleWorkStreams"
  | "nextRoleDepartments"
  | "nextRoleAdditionalInformation"
>): boolean {
  return (
    !nextRoleClassification &&
    !nextRoleTargetRole &&
    !nextRoleTargetRoleOther &&
    !nextRoleJobTitle &&
    !nextRoleCommunity &&
    !nextRoleWorkStreams &&
    !nextRoleDepartments &&
    !nextRoleAdditionalInformation
  );
}

export function hasAnyEmptyFields({
  nextRoleClassification,
  nextRoleTargetRole,
  nextRoleJobTitle,
  nextRoleCommunity,
  nextRoleWorkStreams,
  nextRoleDepartments,
  nextRoleAdditionalInformation,
}: Pick<
  EmployeeProfile,
  | "nextRoleClassification"
  | "nextRoleTargetRole"
  | "nextRoleJobTitle"
  | "nextRoleCommunity"
  | "nextRoleWorkStreams"
  | "nextRoleDepartments"
  | "nextRoleAdditionalInformation"
>): boolean {
  return (
    !nextRoleClassification ||
    !nextRoleTargetRole ||
    !nextRoleJobTitle ||
    !nextRoleCommunity ||
    !nextRoleWorkStreams ||
    !nextRoleDepartments ||
    !nextRoleAdditionalInformation
  );
}
