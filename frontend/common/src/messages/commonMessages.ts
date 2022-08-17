import { defineMessages } from "react-intl";

const messages = defineMessages({
  loadingTitle: {
    defaultMessage: "Loading...",
    description: "Title displayed for a table initial loading state.",
  },
  loadingError: {
    defaultMessage: "Oh no...",
    description: "Title displayed for a table error loading state.",
  },
  required: {
    defaultMessage: "Required",
    description: "Displayed next to required form inputs.",
  },
  optional: {
    defaultMessage: "Optional",
    description: "Displayed next to optional form inputs.",
  },
  notFound: {
    defaultMessage: "Not found",
    description: "Title displayed when an item cannot be found.",
  },
  requiredFieldsMissing: {
    defaultMessage: "There are <red>required</red> fields missing.",
    description:
      "Message that there are required fields missing. Please ignore things in <> tags.",
  },
  backToProfile: {
    defaultMessage: "Go back to my profile",
    description: "Link text for button to return to user profile",
  },
});

export default messages;
