import { defineMessages } from "react-intl";

const messages = defineMessages({
  loadingTitle: {
    defaultMessage: "Loading...",
    id: "B7fcr5",
    description: "Title displayed for a table initial loading state.",
  },
  loadingError: {
    defaultMessage: "Oh no...",
    id: "AvBSV+",
    description: "Title displayed for a table error loading state.",
  },
  required: {
    defaultMessage: "Required",
    id: "Bvr4b6",
    description: "Displayed next to required form inputs.",
  },
  optional: {
    defaultMessage: "Optional",
    id: "WUC9pX",
    description: "Displayed next to optional form inputs.",
  },
  notFound: {
    defaultMessage: "Not found",
    id: "ufSiRU",
    description: "Title displayed when an item cannot be found.",
  },
  requiredFieldsMissing: {
    defaultMessage: "There are <red>required</red> fields missing.",
    id: "ZcvDAo",
    description:
      "Message that there are required fields missing. Please ignore things in <> tags.",
  },
  backToProfile: {
    defaultMessage: "Go back to my profile",
    id: "u+NuHm",
    description: "Link text for button to return to user profile",
  },
  backToApplication: {
    defaultMessage: "Go back to my application",
    id: "HMXnoR",
    description: "Link text for button to return to user application",
  },
});

export default messages;
