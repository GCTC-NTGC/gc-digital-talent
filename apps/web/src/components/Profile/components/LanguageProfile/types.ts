import type {
  EstimatedLanguageAbility,
  EvaluatedLanguageAbility,
  Language,
  Maybe,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  comprehensionLevel?: Maybe<EvaluatedLanguageAbility>;
  writtenLevel?: Maybe<EvaluatedLanguageAbility>;
  verbalLevel?: Maybe<EvaluatedLanguageAbility>;
  estimatedLanguageAbility?: Maybe<EstimatedLanguageAbility>;
  firstOfficialLanguage?: Maybe<Language>;
  secondLanguageExamCompleted?: Maybe<boolean>;
  consideredPositionLanguages: string[];
  secondLanguageExamValidity?: "currently_valid" | "expired" | null;
  preferredLanguageForInterview?: Maybe<Language>;
  preferredLanguageForExam?: Maybe<Language>;
}
