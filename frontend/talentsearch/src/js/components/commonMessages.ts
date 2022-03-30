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
  notFound: {
    defaultMessage: "{type} {id} not found.",
    description: "Message displayed for when requested data fails to load.",
  },
});

export default messages;
