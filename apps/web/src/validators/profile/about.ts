import {
  LocalizedArmedForcesStatus,
  LocalizedCitizenshipStatus,
  LocalizedLanguage,
} from "@gc-digital-talent/graphql";
import { empty } from "@gc-digital-talent/helpers";

export interface PartialUser {
  firstName?: string | null;
  lastName?: string | null;
  telephone?: string | null;
  email?: string | null;
  preferredLang?: LocalizedLanguage | null;
  preferredLanguageForExam?: LocalizedLanguage | null;
  preferredLanguageForInterview?: LocalizedLanguage | null;
  citizenship?: LocalizedCitizenshipStatus | null;
  armedForcesStatus?: LocalizedArmedForcesStatus | null;
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

export function hasEmptyRequiredFields({
  firstName,
  lastName,
  telephone,
  email,
  preferredLang,
  preferredLanguageForInterview,
  preferredLanguageForExam,
  citizenship,
  armedForcesStatus,
}: PartialUser): boolean {
  return (
    !firstName ||
    !lastName ||
    !email ||
    !telephone ||
    !preferredLang ||
    !preferredLanguageForInterview ||
    !preferredLanguageForExam ||
    !citizenship ||
    empty(armedForcesStatus)
  );
}
