import type {
  ArmedForcesStatus,
  CitizenshipStatus,
  Language,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  armedForcesStatus?: ArmedForcesStatus | null | undefined;
  citizenship?: CitizenshipStatus | null | undefined;
  preferredLang?: Language | null | undefined;
  preferredLanguageForInterview?: Language | null | undefined;
  preferredLanguageForExam?: Language | null | undefined;
  telephone?: string | null | undefined;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  email?: string | null | undefined;
  isEmailVerified?: boolean | null | undefined;
}
