import { defineMessages } from "react-intl";

export default defineMessages({
  revertSuccess: {
    defaultMessage: "Decision reverted successfully!",
    id: "QIzz88",
    description: "Success message when an application decision was reverted",
  },
  revertError: {
    defaultMessage: "Error: Could not revert decsision",
    id: "T7MvOg",
    description: "Error message when status decision could not be reverted",
  },
  statusMessage: {
    defaultMessage:
      "Candidates was marked <strong>{status}</strong> on <strong>{date}</strong>",
    id: "VZg3ul",
    description:
      "Message indicating the application status and date it was updated",
  },
  revertSubmit: {
    defaultMessage: "Revert decision and update status",
    id: "uLmAEX",
    description: "Button text to revert an application decision",
  },
});
