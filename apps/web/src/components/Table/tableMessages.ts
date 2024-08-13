import { defineMessages } from "react-intl";

const messages = defineMessages({
  noItemsTitle: {
    defaultMessage: "There aren't any items here.",
    id: "84XrK+",
    description: "Default message for an empty table",
  },
  noRowsSelected: {
    defaultMessage:
      "You have not selected any items. Please select at least one item to download.",
    id: "E/0Y+7",
    description:
      "Warning message when user attempts to download without selecting items first",
  },
});

export default messages;
