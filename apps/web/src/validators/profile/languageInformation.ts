import isEmpty from "lodash/isEmpty";

import type {
  EstimatedLanguageAbility,
  EvaluatedLanguageAbility,
  Language,
  PoolLanguage,
} from "@gc-digital-talent/graphql";
import type { GenericLocalizedEnum } from "@gc-digital-talent/i18n";

import { getMissingLanguageRequirements } from "~/utils/languageUtils";

interface LanguageInformationPool {
  language?: GenericLocalizedEnum<PoolLanguage> | null;
}

interface PartialLanguage {
  value: Language;
}

interface PartialEvaluatedLanguage {
  value: EvaluatedLanguageAbility;
}

interface PartialEstimatedLanguage {
  value: EstimatedLanguageAbility;
}

export interface PartialUser {
  lookingForEnglish?: boolean | null;
  lookingForFrench?: boolean | null;
  lookingForBilingual?: boolean | null;
  secondLanguageExamCompleted?: boolean | null;
  secondLanguageExamValidity?: boolean | null;
  firstOfficialLanguage?: PartialLanguage | null;
  estimatedLanguageAbility?: PartialEstimatedLanguage | null;
  writtenLevel?: PartialEvaluatedLanguage | null;
  comprehensionLevel?: PartialEvaluatedLanguage | null;
  verbalLevel?: PartialEvaluatedLanguage | null;
  preferredLanguageForInterview?: PartialLanguage | null;
  preferredLanguageForExam?: PartialLanguage | null;
}

export function hasAllEmptyFields({
  lookingForEnglish,
  lookingForFrench,
  lookingForBilingual,
  preferredLanguageForInterview,
  preferredLanguageForExam,
}: PartialUser): boolean {
  return (
    !lookingForEnglish &&
    !lookingForFrench &&
    !lookingForBilingual &&
    !preferredLanguageForInterview &&
    !preferredLanguageForExam
  );
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
  preferredLanguageForInterview,
  preferredLanguageForExam,
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
        isEmpty(verbalLevel))) ||
    isEmpty(preferredLanguageForInterview) ||
    isEmpty(preferredLanguageForExam)
  );
}

export function hasUnsatisfiedRequirements(
  user: PartialUser,
  pool: LanguageInformationPool | null,
): boolean {
  return (
    getMissingLanguageRequirements(user, {
      language: pool?.language,
    }).length > 0
  );
}
