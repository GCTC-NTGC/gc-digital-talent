import { defineMessages } from "react-intl";

const messages = defineMessages({
  noItemsTitle: {
    defaultMessage: "There aren't any items here.",
    id: "84XrK+",
    description: "Default message for an empty table",
  },
  noRowsSelected: {
    defaultMessage: "You must select at least one row to download.",
    id: "zCj3LK",
    description:
      "Warning message when user attempts to download without selecting items first",
  },
});

export default messages;
