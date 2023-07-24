import { User } from "~/api/generated";

export type PartialUser = Pick<
  User,
  | "bilingualEvaluation"
  | "comprehensionLevel"
  | "writtenLevel"
  | "verbalLevel"
  | "estimatedLanguageAbility"
  | "lookingForEnglish"
  | "lookingForFrench"
  | "lookingForBilingual"
>;

export type FormValues = Pick<
  User,
  | "bilingualEvaluation"
  | "comprehensionLevel"
  | "writtenLevel"
  | "verbalLevel"
  | "estimatedLanguageAbility"
> & {
  consideredPositionLanguages: string[];
};
