import { defineMessages } from "react-intl";

const labels = defineMessages({
  firstName: {
    defaultMessage: "First name",
    id: "pJBmIm",
    description:
      "Label displayed for the first name field in getting started form.",
  },
  lastName: {
    defaultMessage: "Last name",
    id: "ARdTh3",
    description:
      "Label displayed for the last name field in getting started form.",
  },
  email: {
    defaultMessage: "Contact email",
    id: "etD6Xy",
    description: "Title for contact email input",
  },
  preferredLang: {
    defaultMessage: "Preferred contact language",
    id: "AumMAr",
    description:
      "Legend text for required language preference in getting started form",
  },
  verificationCode: {
    defaultMessage: "Verification code",
    id: "T+ypau",
    description: "label for verification code input",
  },
} as const);

export default labels;
