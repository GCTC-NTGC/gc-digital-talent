import type { CSuiteRoleTitle } from "@gc-digital-talent/graphql";
import { TargetRole } from "@gc-digital-talent/graphql";
import type { LocalizedEnumValue } from "@gc-digital-talent/i18n";

interface IncompleteFields {
  nextRoleTargetRole?: LocalizedEnumValue<TargetRole> | null;
  nextRoleTargetRoleOther?: string | null;
  nextRoleCommunity?: { id: string } | null;
  nextRoleCommunityOther?: string | null;
  nextRoleIsCSuiteRole?: boolean | null;
  nextRoleCSuiteRoleTitle?: LocalizedEnumValue<CSuiteRoleTitle> | null;
}

interface AllFields extends IncompleteFields {
  nextRoleClassification?: { id: string } | null;
  nextRoleJobTitle?: string | null;
  nextRoleWorkStreams?: { id: string }[] | null;
  nextRoleDepartments?: { id: string }[] | null;
  nextRoleAdditionalInformation?: string | null;
}

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
}: AllFields): boolean {
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
}: IncompleteFields): boolean {
  return (
    !nextRoleTargetRole ||
    (nextRoleTargetRole?.value === TargetRole.Other &&
      !nextRoleTargetRoleOther) ||
    (!nextRoleCommunity?.id && !nextRoleCommunityOther) ||
    (!!nextRoleIsCSuiteRole && !nextRoleCSuiteRoleTitle)
  );
}

export function hasEmptyRequiredFields(_: unknown): boolean {
  // no required fields
  return false;
}
