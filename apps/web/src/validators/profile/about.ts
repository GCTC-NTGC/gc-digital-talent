import { empty } from "@gc-digital-talent/helpers";
import {
  LocalizedArmedForcesStatus,
  LocalizedCitizenshipStatus,
  LocalizedLanguage,
  Maybe,
  User,
} from "@gc-digital-talent/graphql";
import { checkFeatureFlag } from "@gc-digital-talent/env";

type PartialLanguage = Maybe<Pick<LocalizedLanguage, "value">>;

export interface PartialUser
  extends Pick<
    User,
    "firstName" | "lastName" | "email" | "telephone" | "isEmailVerified"
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

export function hasEmptyRequiredFields(applicant: PartialUser): boolean {
  const applicationEmailVerification = checkFeatureFlag(
    "FEATURE_APPLICATION_EMAIL_VERIFICATION",
  );

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
    (applicationEmailVerification && !applicant.isEmailVerified)
  );
}
