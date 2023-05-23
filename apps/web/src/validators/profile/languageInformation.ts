import {
  Applicant,
  BilingualEvaluation,
  Pool,
} from "@gc-digital-talent/graphql";
import { getMissingLanguageRequirements } from "~/utils/languageUtils";

type PartialApplicant = Pick<
  Applicant,
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
}: PartialApplicant): boolean {
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
}: PartialApplicant): boolean {
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
}: PartialApplicant): boolean {
  return (
    bilingualEvaluation === BilingualEvaluation.NotCompleted &&
    !estimatedLanguageAbility
  );
}

export function hasUnsatisfiedRequirements(
  applicant: Applicant,
  poolAdvertisement: Pool | null,
): boolean {
  return (
    getMissingLanguageRequirements(applicant, poolAdvertisement).length > 0
  );
}
