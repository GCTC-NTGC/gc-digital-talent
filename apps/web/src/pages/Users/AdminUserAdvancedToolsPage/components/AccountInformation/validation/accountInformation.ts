import type { Language } from "@gc-digital-talent/graphql";
import type { LocalizedEnumValue } from "@gc-digital-talent/i18n";

interface AccountInformationFields {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  telephone?: string | null;
  preferredLang?: LocalizedEnumValue<Language> | null;
  isGovEmployee?: boolean | null;
  workEmail?: string | null;
}

export function hasAllEmptyFields({
  firstName,
  lastName,
  email,
  telephone,
  preferredLang,
  isGovEmployee,
  workEmail,
}: AccountInformationFields): boolean {
  return !!(
    !firstName &&
    !lastName &&
    !email &&
    !telephone &&
    !preferredLang &&
    !isGovEmployee &&
    !workEmail
  );
}

export function hasEmptyRequiredFields({
  firstName,
  lastName,
  email,
  telephone,
  preferredLang,
  isGovEmployee,
  workEmail,
}: AccountInformationFields): boolean {
  return !!(
    !firstName ||
    !lastName ||
    !email ||
    !telephone ||
    !preferredLang ||
    (isGovEmployee && !workEmail)
  );
}
