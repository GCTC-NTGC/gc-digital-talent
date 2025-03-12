import { EmployeeProfile } from "@gc-digital-talent/graphql";

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

export function hasAnyEmptyFields({
  nextRoleClassification,
  nextRoleTargetRole,
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
    !nextRoleClassification ||
    !nextRoleTargetRole ||
    !nextRoleJobTitle ||
    (!nextRoleCommunity && !nextRoleCommunityOther) ||
    ((nextRoleCommunity?.workStreams?.length ?? 0 > 0) &&
      !(nextRoleWorkStreams?.length ?? 0 > 0)) ||
    !(nextRoleDepartments?.length ?? 0 > 0) ||
    !nextRoleAdditionalInformation ||
    (!!nextRoleIsCSuiteRole && !nextRoleCSuiteRoleTitle)
  );
}

export function hasEmptyRequiredFields(
  _: EmployeeProfileNextRoleFragment,
): boolean {
  // no required fields
  return false;
}
