import isEmpty from "lodash/isEmpty";

import {
  User,
  Pool,
  LocalizedLanguage,
  Maybe,
  LocalizedEstimatedLanguageAbility,
  LocalizedEvaluatedLanguageAbility,
} from "@gc-digital-talent/graphql";

import { getMissingLanguageRequirements } from "~/utils/languageUtils";

type PartialLanguage = Maybe<Pick<LocalizedLanguage, "value">>;
type PartialEvaluatedLanguage = Maybe<
  Pick<LocalizedEvaluatedLanguageAbility, "value">
>;

export interface PartialUser
  extends Pick<
    User,
    | "lookingForEnglish"
    | "lookingForFrench"
    | "lookingForBilingual"
    | "secondLanguageExamCompleted"
    | "secondLanguageExamValidity"
  > {
  firstOfficialLanguage?: PartialLanguage;
  estimatedLanguageAbility?: Maybe<
    Pick<LocalizedEstimatedLanguageAbility, "value">
  >;
  writtenLevel?: PartialEvaluatedLanguage;
  comprehensionLevel?: PartialEvaluatedLanguage;
  verbalLevel?: PartialEvaluatedLanguage;
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
  pool: Pick<Pool, "language"> | null,
): boolean {
  return (
    getMissingLanguageRequirements(user, {
      language: pool?.language,
    }).length > 0
  );
}
