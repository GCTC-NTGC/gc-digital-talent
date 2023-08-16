import { commonMessages } from "@gc-digital-talent/i18n";
import { defineMessage, MessageDescriptor } from "react-intl";

export const PAGE_SECTION_ID = {
  INSTRUCTIONS: "instructions",
  PREAMBLE: "preamble",
  ROLE_OF_THE_CIO: "role-of-the-cio",
  WHY_COLLECT: "why-collect",
  REQUIREMENTS: "requirements",
  QUESTIONNAIRE: "questionnaire",
  GENERAL_INFORMATION: "general-information",
  QUESTIONS_DIGITAL_INITIATIVE: "questions-digital-initiative",
  SCOPE_OF_CONTRACT: "scope-of-contract",
  CONTRACT_REQUIREMENTS: "contract-requirements",
  TECHNOLOGICAL_CHANGE: "technological-change",
  OPERATIONS_CONSIDERATIONS: "operations-considerations",
  TALENT_SOURCING_DECISION: "talent-sourcing_decision",
  EXAMPLES_OF_CONTRACTS: "examples-of-contracts",
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
  [
    PAGE_SECTION_ID.GENERAL_INFORMATION,
    defineMessage({
      defaultMessage: "General information",
      id: "D2v0V5",
      description:
        "Heading for the General information section on the digital services contracting questionnaire",
    }),
  ],
  [
    PAGE_SECTION_ID.QUESTIONS_DIGITAL_INITIATIVE,
    defineMessage({
      defaultMessage: "Questions about the digital initiative",
      id: "zl6H2p",
      description:
        "Heading for the Questions about the digital initiative section on the digital services contracting questionnaire",
    }),
  ],
  [
    PAGE_SECTION_ID.SCOPE_OF_CONTRACT,
    defineMessage({
      defaultMessage: "Scope of the contract",
      id: "N631me",
      description:
        "Heading for the Scope of the contract section on the digital services contracting questionnaire",
    }),
  ],
  [
    PAGE_SECTION_ID.CONTRACT_REQUIREMENTS,
    defineMessage({
      defaultMessage: "Requirements",
      id: "IllbQ5",
      description:
        "Heading for the requirements section on the digital services contracting questionnaire",
    }),
  ],
  [
    PAGE_SECTION_ID.TECHNOLOGICAL_CHANGE,
    defineMessage({
      defaultMessage: "Technological change",
      id: "hL3EY7",
      description:
        "Heading for the Technological change section on the digital services contracting questionnaire",
    }),
  ],
  [
    PAGE_SECTION_ID.OPERATIONS_CONSIDERATIONS,
    defineMessage({
      defaultMessage: "Operations considerations",
      id: "ZIDY0W",
      description:
        "Heading for the Operations considerations section on the digital services contracting questionnaire",
    }),
  ],
  [
    PAGE_SECTION_ID.TALENT_SOURCING_DECISION,
    defineMessage({
      defaultMessage: "Talent sourcing decision",
      id: "qmKVmr",
      description:
        "Heading for the Talent sourcing decision section on the digital services contracting questionnaire",
    }),
  ],
  [
    PAGE_SECTION_ID.EXAMPLES_OF_CONTRACTS,
    defineMessage({
      defaultMessage: "Examples of contracts for digital services",
      id: "E6G68c",
      description:
        "Heading for the Examples of contracts for digital services section on the digital services contracting questionnaire",
    }),
  ],
]);

export const getSectionTitle = (key: PageSectionId): MessageDescriptor => {
  const title = sectionTitles.get(key);

  return title ?? commonMessages.notFound;
};
