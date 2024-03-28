import { User } from "@gc-digital-talent/graphql";

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

export type FormValues = Pick<
  User,
  | "comprehensionLevel"
  | "writtenLevel"
  | "verbalLevel"
  | "estimatedLanguageAbility"
  | "firstOfficialLanguage"
  | "secondLanguageExamCompleted"
> & {
  consideredPositionLanguages: string[];
  secondLanguageExamValidity?: "currently_valid" | "expired" | null;
};
