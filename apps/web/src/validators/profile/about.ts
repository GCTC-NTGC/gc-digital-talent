import { empty } from "@gc-digital-talent/helpers";
import type {
  ArmedForcesStatus,
  CitizenshipStatus,
  Language,
} from "@gc-digital-talent/graphql";
import { PoolAreaOfSelection } from "@gc-digital-talent/graphql";
import type {
  GenericLocalizedEnum,
  LocalizedEnumValue,
} from "@gc-digital-talent/i18n";

interface AboutPool {
  areaOfSelection?: GenericLocalizedEnum<PoolAreaOfSelection> | null;
}

export interface PartialUser {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  telephone?: string | null;
  isEmailVerified?: boolean | null;
  workEmail?: string | null;
  isWorkEmailVerified?: boolean | null;
  preferredLang?: LocalizedEnumValue<Language> | null;
  preferredLanguageForInterview?: LocalizedEnumValue<Language> | null;
  preferredLanguageForExam?: LocalizedEnumValue<Language> | null;
  citizenship?: LocalizedEnumValue<CitizenshipStatus> | null;
  armedForcesStatus?: LocalizedEnumValue<ArmedForcesStatus> | null;
}

export function hasAllEmptyFields({
  firstName,
  lastName,
  telephone,
  email,
  preferredLang,
  citizenship,
  armedForcesStatus,
}: PartialUser): boolean {
  return !!(
    !firstName &&
    !lastName &&
    !email &&
    !telephone &&
    !preferredLang &&
    !citizenship &&
    empty(armedForcesStatus)
  );
}

export function hasEmptyRequiredFields(
  applicant: PartialUser,
  pool?: AboutPool | null,
  isSpecialApplication?: boolean | null,
): boolean {
  let isWorkEmailVerifiedForInternalJobs: boolean | undefined | null = true;

  if (
    /* special application bypasses work email verification  */
    pool?.areaOfSelection?.value === PoolAreaOfSelection.Employees &&
    !isSpecialApplication
  ) {
    isWorkEmailVerifiedForInternalJobs =
      !!applicant.workEmail && applicant.isWorkEmailVerified;
  }

  return (
    !applicant.firstName ||
    !applicant.lastName ||
    !applicant.email ||
    !applicant.telephone ||
    !applicant.preferredLang ||
    !applicant.preferredLanguageForInterview ||
    !applicant.preferredLanguageForExam ||
    !applicant.citizenship ||
    empty(applicant.armedForcesStatus) ||
    !applicant.isEmailVerified ||
    !isWorkEmailVerifiedForInternalJobs
  );
}
