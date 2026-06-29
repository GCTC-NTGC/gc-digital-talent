import type {
  EstimatedLanguageAbility,
  EvaluatedLanguageAbility,
  Language,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  comprehensionLevel?: EvaluatedLanguageAbility | null;
  writtenLevel?: EvaluatedLanguageAbility | null;
  verbalLevel?: EvaluatedLanguageAbility | null;
  estimatedLanguageAbility?: EstimatedLanguageAbility | null;
  firstOfficialLanguage?: Language | null;
  secondLanguageExamCompleted?: boolean | null;
  consideredPositionLanguages: string[];
  secondLanguageExamValidity?: "currently_valid" | "expired" | null;
  preferredLanguageForInterview?: Language | null;
  preferredLanguageForExam?: Language | null;
}
