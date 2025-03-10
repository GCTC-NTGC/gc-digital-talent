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
    !nextRoleAdditionalInformation
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
}: EmployeeProfileNextRoleFragment): boolean {
  return (
    !nextRoleClassification ||
    !nextRoleTargetRole ||
    !nextRoleJobTitle ||
    (!nextRoleCommunity && !nextRoleCommunityOther) ||
    ((nextRoleCommunity?.workStreams?.length ?? 0 > 0) &&
      !(nextRoleWorkStreams?.length ?? 0 > 0)) ||
    !(nextRoleDepartments?.length ?? 0 > 0) ||
    !nextRoleAdditionalInformation
  );
}

export function hasEmptyRequiredFields(
  _: EmployeeProfileNextRoleFragment,
): boolean {
  // no required fields
  return false;
}
