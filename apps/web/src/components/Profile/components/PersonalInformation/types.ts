import {
  ArmedForcesStatus,
  CitizenshipStatus,
  Language,
  Maybe,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  armedForcesStatus?: Maybe<ArmedForcesStatus>;
  citizenship?: Maybe<CitizenshipStatus>;
  preferredLang?: Maybe<Language>;
  preferredLanguageForInterview?: Maybe<Language>;
  preferredLanguageForExam?: Maybe<Language>;
  telephone?: Maybe<string>;
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
  email?: Maybe<string>;
  isEmailVerified?: Maybe<boolean>;
}
