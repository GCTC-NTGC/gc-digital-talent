import { TargetRole, type EmployeeProfile } from "@gc-digital-talent/graphql";

type EmployeeProfileNextRoleFragment = Pick<
  EmployeeProfile,
  | "nextRoleClassification"
  | "nextRoleTargetRole"
  | "nextRoleTargetRoleOther"
  | "nextRoleJobTitle"
  | "nextRoleCommunity"
  | "nextRoleCommunityOther"
  | "nextRoleWorkStreams"
  | "nextRoleDepartments"
  | "nextRoleAdditionalInformation"
  | "nextRoleIsCSuiteRole"
  | "nextRoleCSuiteRoleTitle"
>;

export function hasAllEmptyFields({
  nextRoleClassification,
  nextRoleTargetRole,
  nextRoleTargetRoleOther,
  nextRoleJobTitle,
  nextRoleCommunity,
  nextRoleCommunityOther,
  nextRoleWorkStreams,
  nextRoleDepartments,
  nextRoleAdditionalInformation,
  nextRoleIsCSuiteRole,
  nextRoleCSuiteRoleTitle,
}: EmployeeProfileNextRoleFragment): boolean {
  return (
    !nextRoleClassification &&
    !nextRoleTargetRole &&
    !nextRoleTargetRoleOther &&
    !nextRoleJobTitle &&
    !nextRoleCommunity &&
    !nextRoleCommunityOther &&
    !(nextRoleWorkStreams?.length ?? 0 > 0) &&
    !(nextRoleDepartments?.length ?? 0 > 0) &&
    !nextRoleAdditionalInformation &&
    (nextRoleIsCSuiteRole === undefined || nextRoleIsCSuiteRole === null) &&
    !nextRoleCSuiteRoleTitle
  );
}

export function hasIncompleteRequiredFields({
  nextRoleTargetRole,
  nextRoleTargetRoleOther,
  nextRoleCommunity,
  nextRoleCommunityOther,
  nextRoleIsCSuiteRole,
  nextRoleCSuiteRoleTitle,
}: EmployeeProfileNextRoleFragment): boolean {
  return (
    !nextRoleTargetRole ||
    (nextRoleTargetRole?.value === TargetRole.Other &&
      !nextRoleTargetRoleOther) ||
    (!nextRoleCommunity?.id && !nextRoleCommunityOther) ||
    (!!nextRoleIsCSuiteRole && !nextRoleCSuiteRoleTitle)
  );
}

export function hasEmptyRequiredFields(
  _: EmployeeProfileNextRoleFragment,
): boolean {
  // no required fields
  return false;
}
