import { empty } from "@gc-digital-talent/helpers";
import {
  LocalizedArmedForcesStatus,
  LocalizedCitizenshipStatus,
  LocalizedLanguage,
  Maybe,
  User,
} from "@gc-digital-talent/graphql";

type PartialLanguage = Maybe<Pick<LocalizedLanguage, "value">>;

export interface PartialUser extends Pick<
  User,
  "firstName" | "lastName" | "email" | "telephone"
> {
  preferredLang?: PartialLanguage;
  preferredLanguageForInterview?: PartialLanguage;
  preferredLanguageForExam?: PartialLanguage;
  citizenship?: Maybe<Pick<LocalizedCitizenshipStatus, "value">>;
  armedForcesStatus?: Maybe<Pick<LocalizedArmedForcesStatus, "value">>;
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
