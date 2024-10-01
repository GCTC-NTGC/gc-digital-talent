import isEmpty from "lodash/isEmpty";

import { User, Pool } from "@gc-digital-talent/graphql";

import { getMissingLanguageRequirements } from "~/utils/languageUtils";

export type PartialUser = Pick<
  User,
  | "lookingForEnglish"
  | "lookingForFrench"
  | "lookingForBilingual"
  | "estimatedLanguageAbility"
  | "firstOfficialLanguage"
  | "secondLanguageExamCompleted"
  | "secondLanguageExamValidity"
  | "writtenLevel"
  | "comprehensionLevel"
  | "verbalLevel"
>;

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
  pool: Pick<Pool, "language"> | null,
): boolean {
  return (
    getMissingLanguageRequirements(user, {
      language: pool?.language,
    }).length > 0
  );
}
