import type { CSuiteRoleTitle } from "@gc-digital-talent/graphql";
import { TargetRole } from "@gc-digital-talent/graphql";
import type { LocalizedEnumValue } from "@gc-digital-talent/i18n";

interface IncompleteFields {
  careerObjectiveTargetRole?: LocalizedEnumValue<TargetRole> | null;
  careerObjectiveTargetRoleOther?: string | null;
  careerObjectiveCommunity?: { id: string } | null;
  careerObjectiveCommunityOther?: string | null;
  careerObjectiveIsCSuiteRole?: boolean | null;
  careerObjectiveCSuiteRoleTitle?: LocalizedEnumValue<CSuiteRoleTitle> | null;
}

interface AllFields extends IncompleteFields {
  careerObjectiveClassification?: { id: string } | null;
  careerObjectiveJobTitle?: string | null;
  careerObjectiveWorkStreams?: { id: string }[] | null;
  careerObjectiveDepartments?: { id: string }[] | null;
  careerObjectiveAdditionalInformation?: string | null;
}

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
}: AllFields): boolean {
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

export function hasIncompleteRequiredFields({
  careerObjectiveTargetRole,
  careerObjectiveTargetRoleOther,
  careerObjectiveCommunity,
  careerObjectiveCommunityOther,
  careerObjectiveIsCSuiteRole,
  careerObjectiveCSuiteRoleTitle,
}: IncompleteFields): boolean {
  return (
    !careerObjectiveTargetRole ||
    (careerObjectiveTargetRole?.value === TargetRole.Other &&
      !careerObjectiveTargetRoleOther) ||
    (!careerObjectiveCommunity?.id && !careerObjectiveCommunityOther) ||
    (!!careerObjectiveIsCSuiteRole && !careerObjectiveCSuiteRoleTitle)
  );
}

export function hasEmptyRequiredFields(_: unknown): boolean {
  // no required fields
  return false;
}
