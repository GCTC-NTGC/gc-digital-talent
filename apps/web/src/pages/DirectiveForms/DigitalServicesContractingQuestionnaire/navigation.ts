import { commonMessages } from "@gc-digital-talent/i18n";
import { defineMessage, MessageDescriptor } from "react-intl";

export const PAGE_SECTION_ID = {
  INSTRUCTIONS: "instructions",
  PREAMBLE: "preamble",
  ROLE_OF_THE_CIO: "role-of-the-cio",
  WHY_COLLECT: "why-collect",
  REQUIREMENTS: "requirements",
  QUESTIONNAIRE: "questionnaire",
} as const;

type ObjectValues<T> = T[keyof T];
type PageSectionId = ObjectValues<typeof PAGE_SECTION_ID>;

const sectionTitles = new Map<PageSectionId, MessageDescriptor>([
  [
    PAGE_SECTION_ID.INSTRUCTIONS,
    defineMessage({
      defaultMessage: "Instructions",
      id: "epzs/N",
      description:
        "Heading for the Instructions section on the digital services contracting questionnaire",
    }),
  ],
  [
    PAGE_SECTION_ID.PREAMBLE,
    defineMessage({
      defaultMessage: "Preamble",
      id: "1hNh9g",
      description:
        "Heading for the Preamble section on the digital services contracting questionnaire",
    }),
  ],
  [
    PAGE_SECTION_ID.ROLE_OF_THE_CIO,
    defineMessage({
      defaultMessage:
        "Role of the Chief Information Officer of Canada (OCIO) in Digital Talent",
      id: "hrqNod",
      description:
        "Heading for the Role of the CIO section on the digital services contracting questionnaire",
    }),
  ],
  [
    PAGE_SECTION_ID.WHY_COLLECT,
    defineMessage({
      defaultMessage: "Why collect this data?",
      id: "jVfVFG",
      description:
        "Heading for the Why collect section on the digital services contracting questionnaire",
    }),
  ],
  [
    PAGE_SECTION_ID.REQUIREMENTS,
    defineMessage({
      defaultMessage: "Requirements",
      id: "ezstJx",
      description:
        "Heading for the Requirements section on the digital services contracting questionnaire",
    }),
  ],
  [
    PAGE_SECTION_ID.QUESTIONNAIRE,
    defineMessage({
      defaultMessage: "Questionnaire",
      id: "Raho+z",
      description:
        "Heading for the Questionnaire section on the digital services contracting questionnaire",
    }),
  ],
]);

export const getSectionTitle = (key: PageSectionId): MessageDescriptor => {
  const title = sectionTitles.get(key);

  return title ?? commonMessages.notFound;
};
