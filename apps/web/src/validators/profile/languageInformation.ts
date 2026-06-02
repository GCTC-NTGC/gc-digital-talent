import isEmpty from "lodash/isEmpty";

import type {
  User,
  Pool,
  LocalizedLanguage,
  LocalizedEstimatedLanguageAbility,
  LocalizedEvaluatedLanguageAbility,
} from "@gc-digital-talent/graphql";

import { getMissingLanguageRequirements } from "~/utils/languageUtils";

type PartialLanguage = Pick<LocalizedLanguage, "value"> | null;
type PartialEvaluatedLanguage = Pick<
  LocalizedEvaluatedLanguageAbility,
  "value"
> | null;

export interface PartialUser extends Pick<
  User,
  | "lookingForEnglish"
  | "lookingForFrench"
  | "lookingForBilingual"
  | "secondLanguageExamCompleted"
  | "secondLanguageExamValidity"
> {
  firstOfficialLanguage?: PartialLanguage;
  estimatedLanguageAbility?: Pick<
    LocalizedEstimatedLanguageAbility,
    "value"
  > | null;
  writtenLevel?: PartialEvaluatedLanguage;
  comprehensionLevel?: PartialEvaluatedLanguage;
  verbalLevel?: PartialEvaluatedLanguage;
  preferredLanguageForInterview?: PartialLanguage;
  preferredLanguageForExam?: PartialLanguage;
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
  pool: Pick<Pool, "language"> | null,
): boolean {
  return (
    getMissingLanguageRequirements(user, {
      language: pool?.language,
    }).length > 0
  );
}
