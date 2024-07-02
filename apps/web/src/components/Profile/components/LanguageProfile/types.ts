import {
  EstimatedLanguageAbility,
  EvaluatedLanguageAbility,
  Language,
  Maybe,
  User,
} from "@gc-digital-talent/graphql";

export type PartialUser = Pick<
  User,
  | "comprehensionLevel"
  | "writtenLevel"
  | "verbalLevel"
  | "estimatedLanguageAbility"
  | "lookingForEnglish"
  | "lookingForFrench"
  | "lookingForBilingual"
  | "firstOfficialLanguage"
  | "secondLanguageExamCompleted"
  | "secondLanguageExamValidity"
>;

export type FormValues = {
  comprehensionLevel?: Maybe<EvaluatedLanguageAbility>;
  writtenLevel?: Maybe<EvaluatedLanguageAbility>;
  verbalLevel?: Maybe<EvaluatedLanguageAbility>;
  estimatedLanguageAbility?: Maybe<EstimatedLanguageAbility>;
  firstOfficialLanguage?: Maybe<Language>;
  secondLanguageExamCompleted?: Maybe<boolean>;
  consideredPositionLanguages: string[];
  secondLanguageExamValidity?: "currently_valid" | "expired" | null;
};
