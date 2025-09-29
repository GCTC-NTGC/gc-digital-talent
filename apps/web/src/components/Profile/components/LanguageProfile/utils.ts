import omit from "lodash/omit";
import compact from "lodash/compact";

import {
  Maybe,
  ProfileLanguageProfileFragment,
  UpdateUserAsUserInput,
} from "@gc-digital-talent/graphql";

import { FormValues } from "./types";

export const formValuesToSubmitData = (
  formValues: FormValues,
): UpdateUserAsUserInput => {
  let secondLanguageExamValidity: Maybe<boolean> | undefined = null;
  switch (formValues?.secondLanguageExamValidity) {
    case "currently_valid":
      secondLanguageExamValidity = true;
      break;
    case "expired":
      secondLanguageExamValidity = false;
      break;
    default:
      secondLanguageExamValidity = null;
  }
  const data: UpdateUserAsUserInput = {
    ...omit(formValues, [
      "consideredPositionLanguages",
      "secondLanguageExamCompleted",
      "secondLanguageExamValidity",
    ]),
    lookingForEnglish:
      formValues.consideredPositionLanguages.includes("lookingForEnglish"),
    lookingForFrench:
      formValues.consideredPositionLanguages.includes("lookingForFrench"),
    lookingForBilingual: formValues.consideredPositionLanguages.includes(
      "lookingForBilingual",
    ),
    firstOfficialLanguage: formValues.firstOfficialLanguage ?? undefined,
    secondLanguageExamCompleted: formValues.secondLanguageExamCompleted,
    secondLanguageExamValidity,
  };

  // various IF statements are to clean up cases where user toggles the conditionally rendered stuff before submitting
  // IE, picks looking for bilingual, then picks completed english evaluation before submitting, the conditionally rendered stuff still exists and can get submitted
  if (!data.lookingForBilingual) {
    data.firstOfficialLanguage = null;
    data.estimatedLanguageAbility = null;
    data.secondLanguageExamCompleted = null;
    data.secondLanguageExamValidity = null;
    data.comprehensionLevel = null;
    data.writtenLevel = null;
    data.verbalLevel = null;
  }

  if (!data.secondLanguageExamCompleted) {
    data.secondLanguageExamValidity = null;
    data.comprehensionLevel = null;
    data.writtenLevel = null;
    data.verbalLevel = null;
  }

  return data;
};

export const dataToFormValues = (
  data: ProfileLanguageProfileFragment,
): FormValues => {
  let secondLanguageExamValidity: FormValues["secondLanguageExamValidity"] =
    null;
  switch (data?.secondLanguageExamValidity) {
    case true:
      secondLanguageExamValidity = "currently_valid";
      break;
    case false:
      secondLanguageExamValidity = "expired";
      break;
    default:
      secondLanguageExamValidity = null;
  }
  return {
    consideredPositionLanguages: compact([
      data?.lookingForEnglish ? "lookingForEnglish" : "",
      data?.lookingForFrench ? "lookingForFrench" : "",
      data?.lookingForBilingual ? "lookingForBilingual" : "",
    ]),
    comprehensionLevel: data?.comprehensionLevel?.value,
    writtenLevel: data?.writtenLevel?.value,
    verbalLevel: data?.verbalLevel?.value,
    estimatedLanguageAbility: data?.estimatedLanguageAbility?.value,
    firstOfficialLanguage: data?.firstOfficialLanguage?.value,
    secondLanguageExamCompleted: data?.secondLanguageExamCompleted,
    secondLanguageExamValidity,
  };
};
