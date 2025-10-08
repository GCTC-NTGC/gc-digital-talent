import { IntlShape, MessageDescriptor } from "react-intl";

import {
  User,
  Pool,
  PoolLanguage,
  EstimatedLanguageAbility,
} from "@gc-digital-talent/graphql";

export type PartialUser = Pick<User, "lookingForBilingual">;

// Is the user missing the "looking for bilingual" profile option for this bilingual pool?
const isMissingLookingForBilingual = (
  user?: PartialUser,
  pool?: Pick<Pool, "language"> | null,
): boolean => {
  const userLookingForBilingual = !!user?.lookingForBilingual;
  const poolNeedsBilingual =
    pool?.language?.value === PoolLanguage.BilingualIntermediate ||
    pool?.language?.value === PoolLanguage.BilingualAdvanced;

  if (poolNeedsBilingual && !userLookingForBilingual) return true;

  return false;
};

// Get a list of missing language requirement error message descriptors
export const getMissingLanguageRequirements = (
  user?: PartialUser,
  pool?: Pick<Pool, "language"> | null,
): MessageDescriptor[] => {
  const errorMessages: MessageDescriptor[] = [];

  if (isMissingLookingForBilingual(user, pool))
    errorMessages.push({
      defaultMessage: "Bilingual positions (English and French)",
      id: "6eCvv1",
      description: "Bilingual Positions message",
    });

  return errorMessages;
};

export const getLabels = (intl: IntlShape) => ({
  consideredPositionLanguages: intl.formatMessage({
    defaultMessage: "Language of positions you would like to be considered for",
    id: "D1ZXOz",
    description:
      "Legend for considered position languages check list in language information form",
  }),
  firstOfficialLanguage: intl.formatMessage({
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
      defaultMessage: "English-only positions",
      id: "i0K4Sb",
      description: "Message for the english positions option",
    }),
  },
  {
    value: "lookingForFrench",
    label: intl.formatMessage({
      defaultMessage: "French-only positions",
      id: "Be4zZT",
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
