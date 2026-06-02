import type {
  ArmedForcesStatus,
  CitizenshipStatus,
  Language,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  armedForcesStatus?: ArmedForcesStatus | null;
  citizenship?: CitizenshipStatus | null;
  preferredLang?: Language | null;
  preferredLanguageForInterview?: Language | null;
  preferredLanguageForExam?: Language | null;
  telephone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  isEmailVerified?: boolean | null;
}
