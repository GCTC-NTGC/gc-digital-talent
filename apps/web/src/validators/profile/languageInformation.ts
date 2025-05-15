import isEmpty from "lodash/isEmpty";

import {
  LocalizedLanguage,
  LocalizedEstimatedLanguageAbility,
  LocalizedEvaluatedLanguageAbility,
  LocalizedPoolLanguage,
} from "@gc-digital-talent/graphql";

import { getMissingLanguageRequirements } from "~/utils/languageUtils";

export interface PartialUser {
  lookingForEnglish?: boolean | null;
  lookingForFrench?: boolean | null;
  lookingForBilingual?: boolean | null;
  firstOfficialLanguage?: LocalizedLanguage | null;
  estimatedLanguageAbility?: LocalizedEstimatedLanguageAbility | null;
  secondLanguageExamCompleted?: boolean | null;
  secondLanguageExamValidity?: boolean | null;
  writtenLevel?: LocalizedEvaluatedLanguageAbility | null;
  comprehensionLevel?: LocalizedEvaluatedLanguageAbility | null;
  verbalLevel?: LocalizedEvaluatedLanguageAbility | null;
}

export function hasAllEmptyFields({
  lookingForEnglish,
  lookingForFrench,
  lookingForBilingual,
}: PartialUser): boolean {
  return !lookingForEnglish && !lookingForFrench && !lookingForBilingual;
}

export function hasEmptyRequiredFields({
  lookingForEnglish,
  lookingForFrench,
  lookingForBilingual,
  firstOfficialLanguage,
  estimatedLanguageAbility,
  secondLanguageExamCompleted,
  secondLanguageExamValidity,
  writtenLevel,
  comprehensionLevel,
  verbalLevel,
}: PartialUser): boolean {
  return !!(
    (!lookingForEnglish && !lookingForFrench && !lookingForBilingual) ||
    (lookingForBilingual &&
      (isEmpty(firstOfficialLanguage) || isEmpty(estimatedLanguageAbility))) ||
    (secondLanguageExamCompleted &&
      (secondLanguageExamValidity === null ||
        secondLanguageExamValidity === undefined ||
        isEmpty(writtenLevel) ||
        isEmpty(comprehensionLevel) ||
        isEmpty(verbalLevel)))
  );
}

export function hasUnsatisfiedRequirements(
  user: PartialUser,
  pool: {
    language?: LocalizedPoolLanguage | null;
  } | null,
): boolean {
  return (
    getMissingLanguageRequirements(user, {
      language: pool?.language,
    }).length > 0
  );
}
