import { empty } from "@gc-digital-talent/helpers";
import type {
  LocalizedArmedForcesStatus,
  LocalizedCitizenshipStatus,
  LocalizedLanguage,
  Pool,
  User,
} from "@gc-digital-talent/graphql";
import { PoolAreaOfSelection } from "@gc-digital-talent/graphql";

type PartialLanguage = Pick<LocalizedLanguage, "value"> | null;

export interface PartialUser extends Pick<
  User,
  | "firstName"
  | "lastName"
  | "email"
  | "telephone"
  | "isEmailVerified"
  | "workEmail"
  | "isWorkEmailVerified"
> {
  preferredLang?: PartialLanguage;
  preferredLanguageForInterview?: PartialLanguage;
  preferredLanguageForExam?: PartialLanguage;
  citizenship?: Pick<LocalizedCitizenshipStatus, "value"> | null;
  armedForcesStatus?: Pick<LocalizedArmedForcesStatus, "value"> | null;
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
  pool?: Pick<Pool, "areaOfSelection"> | null,
): boolean {
  let isWorkEmailVerifiedForInternalJobs: boolean | undefined | null = true;

  if (pool?.areaOfSelection?.value === PoolAreaOfSelection.Employees) {
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
