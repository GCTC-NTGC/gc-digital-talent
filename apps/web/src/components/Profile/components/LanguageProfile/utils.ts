import { IntlShape } from "react-intl";
import omit from "lodash/omit";
import compact from "lodash/compact";

import {
  EstimatedLanguageAbility,
  Maybe,
  UpdateUserAsUserInput,
} from "@gc-digital-talent/graphql";

import { FormValues, PartialUser } from "./types";

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

export const dataToFormValues = (data: PartialUser): FormValues => {
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

export const getLabels = (intl: IntlShape) => ({
  consideredPositionLanguages: intl.formatMessage({
    defaultMessage: "Language of positions they'd like to be considered for",
    id: "96w8Lm",
    description:
      "Legend for considered position languages check list in language information form",
  }),
  yourFirstOfficialLang: intl.formatMessage({
    defaultMessage: "Your first official language",
    id: "CwGljY",
    description:
      "Legend first official language status in language information form",
  }),
  firstOfficialLang: intl.formatMessage({
    defaultMessage: "First official language",
    id: "Fj98cE",
    description: "Label for first official language on field display",
  }),
  comprehensionLevel: intl.formatMessage({
    defaultMessage: "Comprehension level",
    id: "kqOTFT",
    description:
      "Label displayed on the language information form reading comprehension field.",
  }),
  writtenLevel: intl.formatMessage({
    defaultMessage: "Writing level",
    id: "0EuaJv",
    description:
      "Label displayed on the language information form written field.",
  }),
  verbalLevel: intl.formatMessage({
    defaultMessage: "Oral communication level",
    id: "CMtxbk",
    description:
      "Label displayed on the language information form oral communication field.",
  }),
  estimatedLanguageAbility: intl.formatMessage({
    defaultMessage: "Second language proficiency level",
    id: "T1TKNL",
    description:
      "Legend for second language proficiency level in language information form",
  }),
  secondLanguageExamCompletedBoundingBoxLabel: intl.formatMessage({
    defaultMessage: "Official exam status",
    id: "FGzaie",
    description:
      "Bounding box label for official exam status in language information form",
  }),
  secondLanguageExamCompletedLabel: intl.formatMessage({
    defaultMessage:
      "I have completed a Public Service Commission evaluation of my <strong>second official language</strong>.",
    id: "rjfQMg",
    description: "Label for official exam status in language information form",
  }),
  secondLanguageExamValidityLabel: intl.formatMessage({
    defaultMessage: "Exam validity",
    id: "/tRBrf",
    description: "Label for exam validity in language information form",
  }),
  prefSpokenInterviewLang: intl.formatMessage({
    defaultMessage: "Preferred spoken interview language",
    id: "DB9pFd",
    description: "Title for preferred spoken interview language",
  }),
  prefWrittenExamLang: intl.formatMessage({
    defaultMessage: "Preferred written exam language",
    id: "fg2wla",
    description: "Title for preferred written exam language",
  }),
});

export const getConsideredLangItems = (intl: IntlShape) => [
  {
    value: "lookingForEnglish",
    label: intl.formatMessage({
      defaultMessage: "English positions",
      id: "JBRqD9",
      description: "Message for the english positions option",
    }),
  },
  {
    value: "lookingForFrench",
    label: intl.formatMessage({
      defaultMessage: "French positions",
      id: "5pQfyv",
      description: "Message for the french positions option",
    }),
  },
  {
    value: "lookingForBilingual",
    label: intl.formatMessage({
      defaultMessage: "Bilingual positions (English and French)",
      id: "6eCvv1",
      description: "Bilingual Positions message",
    }),
  },
];

export const getEstimatedAbilityOptions = (intl: IntlShape) => [
  {
    value: EstimatedLanguageAbility.Beginner,
    label: intl.formatMessage({
      defaultMessage:
        "Beginner <gray>- I have basic reading, writing and verbal communication skills.</gray>",
      id: "ZuFBx5",
      description: "Message for the beginner language ability option",
    }),
  },
  {
    value: EstimatedLanguageAbility.Intermediate,
    label: intl.formatMessage({
      defaultMessage:
        "Intermediate <gray>- I have strong reading, writing and verbal communication skills.</gray>",
      id: "t5G3Fz",
      description: "Message for the intermediate language ability option",
    }),
  },
  {
    value: EstimatedLanguageAbility.Advanced,
    label: intl.formatMessage({
      defaultMessage: "Advanced <gray>- I am completely fluent.</gray>",
      id: "paLFgh",
      description: "Message for the advanced language ability option",
    }),
  },
];

export const getExamValidityOptions = (intl: IntlShape) => [
  {
    label: intl.formatMessage({
      defaultMessage:
        "“All three of my language level exams are <strong>currently valid</strong>.”",
      id: "gS9T4G",
      description:
        "Radio option for exam validity input on language information form.",
    }),
    value: "currently_valid",
  },
  {
    label: intl.formatMessage({
      defaultMessage:
        "“One or more of my language levels are <strong>expired</strong>.”",
      id: "KehmPp",
      description:
        "Radio option for exam validity input on language information form.",
    }),
    value: "expired",
  },
];
