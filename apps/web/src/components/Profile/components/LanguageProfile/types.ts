import { User } from "~/api/generated";

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
