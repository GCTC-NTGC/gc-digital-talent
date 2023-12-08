import { User, BilingualEvaluation, Pool } from "~/api/generated";
import { getMissingLanguageRequirements } from "~/utils/languageUtils";

export type PartialUser = Pick<
  User,
  | "lookingForEnglish"
  | "lookingForFrench"
  | "lookingForBilingual"
  | "bilingualEvaluation"
  | "estimatedLanguageAbility"
  | "writtenLevel"
  | "comprehensionLevel"
  | "verbalLevel"
>;

export function hasAllEmptyFields({
  lookingForEnglish,
  lookingForFrench,
  lookingForBilingual,
  bilingualEvaluation,
}: PartialUser): boolean {
  return (
    !lookingForEnglish &&
    !lookingForFrench &&
    !lookingForBilingual &&
    !bilingualEvaluation
  );
}

export function hasEmptyRequiredFields({
  lookingForEnglish,
  lookingForFrench,
  lookingForBilingual,
  bilingualEvaluation,
  writtenLevel,
  comprehensionLevel,
  verbalLevel,
}: PartialUser): boolean {
  return !!(
    (!lookingForEnglish && !lookingForFrench && !lookingForBilingual) ||
    (lookingForBilingual &&
      (!bilingualEvaluation ||
        ((bilingualEvaluation === BilingualEvaluation.CompletedEnglish ||
          bilingualEvaluation === BilingualEvaluation.CompletedFrench) &&
          (!comprehensionLevel || !writtenLevel || !verbalLevel))))
  );
}

export function hasUnsatisfiedRequirements(
  user: PartialUser,
  pool: Pool | null,
): boolean {
  return getMissingLanguageRequirements(user, pool).length > 0;
}
