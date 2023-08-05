import { User } from "@gc-digital-talent/graphql";
import { empty } from "@gc-digital-talent/helpers";

export type PartialUser = Pick<
  User,
  | "firstName"
  | "lastName"
  | "email"
  | "telephone"
  | "preferredLang"
  | "preferredLanguageForInterview"
  | "preferredLanguageForExam"
  | "currentCity"
  | "currentProvince"
  | "citizenship"
  | "armedForcesStatus"
>;

export function hasAllEmptyFields({
  firstName,
  lastName,
  telephone,
  email,
  preferredLang,
  currentCity,
  currentProvince,
  citizenship,
  armedForcesStatus,
}: PartialUser): boolean {
  return !!(
    !firstName &&
    !lastName &&
    !email &&
    !telephone &&
    !preferredLang &&
    !currentCity &&
    !currentProvince &&
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
  currentCity,
  currentProvince,
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
    !preferredLanguageForInterview ||
    !currentCity ||
    !currentProvince ||
    !citizenship ||
    empty(armedForcesStatus)
  );
}
