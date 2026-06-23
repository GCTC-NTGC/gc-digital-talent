import { defineMessages } from "react-intl";

export default defineMessages({
  changeStatus: {
    defaultMessage: "Change status to {status}",
    id: "3c8iw6",
    description:
      "Action to change the status of selected tracked users in the inbox",
  },
  referred: {
    defaultMessage: "Referred",
    id: "r9yxSn",
    description: "Tracked user status: referred",
  },
  updateSuccess: {
    defaultMessage: "Tracked users updated successfully.",
    id: "p6y+4U",
    description:
      "Toast shown when a tracked-user bulk status change succeeds in the inbox",
  },
  updateError: {
    defaultMessage: "Error: failed to update tracked users.",
    id: "Us+OYQ",
    description:
      "Toast shown when a tracked-user bulk status change fails in the inbox",
  },
});
