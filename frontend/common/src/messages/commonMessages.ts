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
});

export default messages;
