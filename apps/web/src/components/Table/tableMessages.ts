import { defineMessages } from "react-intl";

const messages = defineMessages({
  noItemsTitle: {
    defaultMessage: "There aren't any items here.",
    id: "84XrK+",
    description: "Default message for an empty table",
  },
  selectAll: {
    defaultMessage: "Select all",
    id: "Lu5ppY",
    description: "Label for the checkbox to select all rows in a table",
  },
  actions: {
    defaultMessage: "Actions",
    id: "nGx7Xt",
    description: "Title displayed for actions column",
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
