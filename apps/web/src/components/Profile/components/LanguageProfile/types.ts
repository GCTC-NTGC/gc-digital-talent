import type {
  EstimatedLanguageAbility,
  EvaluatedLanguageAbility,
  Language,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  comprehensionLevel?: EvaluatedLanguageAbility | null | undefined;
  writtenLevel?: EvaluatedLanguageAbility | null | undefined;
  verbalLevel?: EvaluatedLanguageAbility | null | undefined;
  estimatedLanguageAbility?: EstimatedLanguageAbility | null | undefined;
  firstOfficialLanguage?: Language | null | undefined;
  secondLanguageExamCompleted?: boolean | null | undefined;
  consideredPositionLanguages: string[];
  secondLanguageExamValidity?: "currently_valid" | "expired" | null;
  preferredLanguageForInterview?: Language | null | undefined;
  preferredLanguageForExam?: Language | null | undefined;
}
