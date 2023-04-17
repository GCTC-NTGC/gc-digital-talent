import { Applicant } from "@gc-digital-talent/graphql";

type PartialApplicant = Pick<
  Applicant,
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
}: PartialApplicant): boolean {
  return !!(
    !firstName &&
    !lastName &&
    !email &&
    !telephone &&
    !preferredLang &&
    !currentCity &&
    !currentProvince &&
    !citizenship &&
    armedForcesStatus === null
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
}: PartialApplicant): boolean {
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
    armedForcesStatus === null
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function hasEmptyOptionalFields(applicant: PartialApplicant): boolean {
  // no optional fields
  return false;
}
