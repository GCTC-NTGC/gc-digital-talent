import { defineMessages } from "react-intl";

const messages = defineMessages({
  loadingTitle: {
    id: "loadingTitle",
    defaultMessage: "Loading...",
    description: "Title displayed for a table loading state.",
  },
  errorTitle: {
    id: "errorTitle",
    defaultMessage: "Oh no...",
    description: "Title displayed for a table error state.",
  },
});

export default messages;
