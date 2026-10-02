import isEmpty from "lodash/isEmpty";

import type {
  EstimatedLanguageAbility,
  EvaluatedLanguageAbility,
  Language,
  PoolLanguage,
} from "@gc-digital-talent/graphql";
import type {
  GenericLocalizedEnum,
  LocalizedEnumValue,
} from "@gc-digital-talent/i18n";

import { getMissingLanguageRequirements } from "~/utils/languageUtils";

interface LanguageInformationPool {
  language?: GenericLocalizedEnum<PoolLanguage> | null;
}

export interface PartialUser {
  lookingForEnglish?: boolean | null;
  lookingForFrench?: boolean | null;
  lookingForBilingual?: boolean | null;
  secondLanguageExamCompleted?: boolean | null;
  secondLanguageExamValidity?: boolean | null;
  firstOfficialLanguage?: LocalizedEnumValue<Language> | null;
  estimatedLanguageAbility?: LocalizedEnumValue<EstimatedLanguageAbility> | null;
  writtenLevel?: LocalizedEnumValue<EvaluatedLanguageAbility> | null;
  comprehensionLevel?: LocalizedEnumValue<EvaluatedLanguageAbility> | null;
  verbalLevel?: LocalizedEnumValue<EvaluatedLanguageAbility> | null;
  preferredLanguageForInterview?: LocalizedEnumValue<Language> | null;
  preferredLanguageForExam?: LocalizedEnumValue<Language> | null;
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
