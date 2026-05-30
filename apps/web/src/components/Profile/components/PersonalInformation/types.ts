import type {
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
  telephone?: string | null | undefined;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  email?: string | null | undefined;
  isEmailVerified?: boolean | null | undefined;
}
