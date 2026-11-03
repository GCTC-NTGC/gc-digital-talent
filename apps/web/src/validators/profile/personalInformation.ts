import type { Language } from "@gc-digital-talent/graphql";
import { PoolAreaOfSelection } from "@gc-digital-talent/graphql";
import type {
  GenericLocalizedEnum,
  LocalizedEnumValue,
} from "@gc-digital-talent/i18n";

export interface AboutPool {
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
}

export function hasAllEmptyFields({
  firstName,
  lastName,
  telephone,
  email,
  preferredLang,
}: PartialUser): boolean {
  return !!(!firstName && !lastName && !email && !telephone && !preferredLang);
}

export function hasMissingRequiredWorkEmail(
  applicant: PartialUser,
  pool?: AboutPool | null,
  isSpecialApplication?: boolean | null,
): boolean {
  /* special application bypasses work email verification  */
  if (
    pool?.areaOfSelection?.value !== PoolAreaOfSelection.Employees ||
    isSpecialApplication
  ) {
    return false;
  }

  return !applicant.workEmail || !applicant.isWorkEmailVerified;
}

export function hasEmptyRequiredFields(
  applicant: PartialUser,
  pool?: AboutPool | null,
  isSpecialApplication?: boolean | null,
): boolean {
  return (
    !applicant.firstName ||
    !applicant.lastName ||
    !applicant.email ||
    !applicant.telephone ||
    !applicant.preferredLang ||
    !applicant.isEmailVerified ||
    hasMissingRequiredWorkEmail(applicant, pool, isSpecialApplication)
  );
}
