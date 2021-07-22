import { defineMessages } from "react-intl";

const messages = defineMessages({
  loadingTitle: {
    id: "common.loading.title",
    defaultMessage: "Loading...",
    description: "Title displayed for a table initial loading state.",
  },
  loadingError: {
    id: "common.loading.error",
    defaultMessage: "Oh no...",
    description: "Title displayed for a table error loading state.",
  },
});

export default messages;
