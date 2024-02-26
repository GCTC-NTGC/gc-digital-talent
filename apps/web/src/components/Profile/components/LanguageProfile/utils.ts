import { IntlShape } from "react-intl";
import omit from "lodash/omit";
import compact from "lodash/compact";

import { BilingualEvaluation, EstimatedLanguageAbility } from "~/api/generated";

import { FormValues, PartialUser } from "./types";

export const formValuesToSubmitData = (formValues: FormValues) => {
  const data = {
    ...omit(formValues, ["consideredPositionLanguages"]),
    lookingForEnglish:
      formValues.consideredPositionLanguages.includes("lookingForEnglish"),
    lookingForFrench:
      formValues.consideredPositionLanguages.includes("lookingForFrench"),
    lookingForBilingual: formValues.consideredPositionLanguages.includes(
      "lookingForBilingual",
    ),
  };

  // various IF statements are to clean up cases where user toggles the conditionally rendered stuff before submitting
  // IE, picks looking for bilingual, then picks completed english evaluation before submitting, the conditionally rendered stuff still exists and can get submitted
  if (!data.lookingForBilingual) {
    data.bilingualEvaluation = null;
  }
  if (
    data.bilingualEvaluation !== BilingualEvaluation.CompletedEnglish &&
    data.bilingualEvaluation !== BilingualEvaluation.CompletedFrench
  ) {
    data.comprehensionLevel = null;
    data.writtenLevel = null;
    data.verbalLevel = null;
  }
  if (data.bilingualEvaluation !== BilingualEvaluation.NotCompleted) {
    data.estimatedLanguageAbility = null;
  }

  return data;
};

export const dataToFormValues = (data: PartialUser): FormValues => {
  return {
    consideredPositionLanguages: compact([
      data?.lookingForEnglish ? "lookingForEnglish" : "",
      data?.lookingForFrench ? "lookingForFrench" : "",
      data?.lookingForBilingual ? "lookingForBilingual" : "",
    ]),
    bilingualEvaluation: data?.bilingualEvaluation
      ? data.bilingualEvaluation
      : BilingualEvaluation.CompletedEnglish,
    comprehensionLevel: data?.comprehensionLevel,
    writtenLevel: data?.writtenLevel,
    verbalLevel: data?.verbalLevel,
    estimatedLanguageAbility: data?.estimatedLanguageAbility,
  };
};

export const getLabels = (intl: IntlShape) => ({
  consideredPositionLanguages: intl.formatMessage({
    defaultMessage: "I would like to be considered for",
    id: "TiVKPr",
    description:
      "Legend for considered position languages check list in language information form",
  }),
  bilingualEvaluation: intl.formatMessage({
    defaultMessage: "Bilingual evaluation",
    id: "X354at",
    description:
      "Legend bilingual evaluation status in language information form",
  }),
  comprehensionLevel: intl.formatMessage({
    defaultMessage: "Reading",
    id: "g8Xd4a",
    description:
      "Label displayed on the language information form reading comprehension field.",
  }),
  writtenLevel: intl.formatMessage({
    defaultMessage: "Writing",
    id: "mBnz9m",
    description:
      "Label displayed on the language information form written field.",
  }),
  verbalLevel: intl.formatMessage({
    defaultMessage: "Oral interaction",
    id: "mvYSmp",
    description:
      "Label displayed on the language information form oral interaction field.",
  }),
  estimatedLanguageAbility: intl.formatMessage({
    defaultMessage: "Second language proficiency level",
    id: "T1TKNL",
    description:
      "Legend for second language proficiency level in language information form",
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

export const getBilingualEvaluationItems = (
  intl: IntlShape,
  languageEvaluationPageLink: () => JSX.Element,
) => [
  {
    value: BilingualEvaluation.CompletedEnglish,
    label: intl.formatMessage(
      {
        defaultMessage:
          "I am bilingual (En/Fr) and <strong>have</strong> completed an official <strong>ENGLISH</strong> <languageEvaluationPageLink></languageEvaluationPageLink>.",
        id: "HPDqDV",
        description:
          "Message for the completed english bilingual evaluation option",
      },
      {
        languageEvaluationPageLink,
      },
    ),
  },
  {
    value: BilingualEvaluation.CompletedFrench,
    label: intl.formatMessage(
      {
        defaultMessage:
          "I am bilingual (En/Fr) and <strong>have</strong> completed an official <strong>FRENCH</strong> <languageEvaluationPageLink></languageEvaluationPageLink>.",
        id: "shwFSK",
        description:
          "Message for the completed french bilingual evaluation option",
      },
      {
        languageEvaluationPageLink,
      },
    ),
  },
  {
    value: BilingualEvaluation.NotCompleted,
    label: intl.formatMessage(
      {
        defaultMessage:
          "I am bilingual (En/Fr) and <strong>have NOT</strong> completed an official <languageEvaluationPageLink></languageEvaluationPageLink>.",
        id: "5g49WB",
        description:
          "Message for the haven't completed bilingual evaluation option",
      },
      {
        languageEvaluationPageLink,
      },
    ),
  },
];
