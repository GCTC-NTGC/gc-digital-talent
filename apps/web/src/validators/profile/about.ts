import { empty } from "@gc-digital-talent/helpers";
import {
  LocalizedArmedForcesStatus,
  LocalizedCitizenshipStatus,
  LocalizedLanguage,
  Maybe,
  Pool,
  PoolAreaOfSelection,
  User,
} from "@gc-digital-talent/graphql";
import { checkFeatureFlag } from "@gc-digital-talent/env";

type PartialLanguage = Maybe<Pick<LocalizedLanguage, "value">>;

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

export function hasEmptyRequiredFields(
  applicant: PartialUser,
  pool?: Maybe<Pick<Pool, "areaOfSelection">>,
): boolean {
  const applicationEmailVerification = checkFeatureFlag(
    "FEATURE_APPLICATION_EMAIL_VERIFICATION",
  );

  // Refactor after feature flag is turned on #15052
  let isWorkEmailVerifiedForInternalJobs: boolean | undefined | null = true;

  if (applicationEmailVerification) {
    if (pool?.areaOfSelection?.value === PoolAreaOfSelection.Employees) {
      isWorkEmailVerifiedForInternalJobs =
        !!applicant.workEmail && applicant.isWorkEmailVerified;
    }
  } // Refactor after feature flag is turned on #15052

  return (
    !applicant.applicant.firstName ||
    !applicant.applicant.lastName ||
    !applicant.applicant.email ||
    !applicant.applicant.telephone ||
    !applicant.applicant.preferredLang ||
    !applicant.applicant.preferredLanguageForInterview ||
    !applicant.applicant.preferredLanguageForExam ||
    !applicant.applicant.citizenship ||
    empty(applicant.applicant.armedForcesStatus) ||
    (applicationEmailVerification && !applicant.isEmailVerified) ||
    !isWorkEmailVerifiedForInternalJobs
  );
}
