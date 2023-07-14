import { User, BilingualEvaluation, Pool } from "@gc-digital-talent/graphql";
import { getMissingLanguageRequirements } from "~/utils/languageUtils";

type PartialUser = Pick<
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

export function hasEmptyOptionalFields({
  bilingualEvaluation,
  estimatedLanguageAbility,
}: PartialUser): boolean {
  return (
    bilingualEvaluation === BilingualEvaluation.NotCompleted &&
    !estimatedLanguageAbility
  );
}

export function hasUnsatisfiedRequirements(
  user: User,
  pool: Pool | null,
): boolean {
  return getMissingLanguageRequirements(user, pool).length > 0;
}
