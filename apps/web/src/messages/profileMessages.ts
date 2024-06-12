import { defineMessages } from "react-intl";

const messages = defineMessages({
  profileCompleted: {
    defaultMessage:
      "All required fields are complete. You can now change your status.",
    id: "hTJgV2",
    description: "Message displayed to user when user profile completed.",
  },
  updatingFailed: {
    defaultMessage: "Error: updating user failed",
    id: "5FFRV2",
    description: "Message displayed to user after user fails to get updated.",
  },
  userNotFound: {
    defaultMessage: "User not found.",
    id: "2cUBGT",
    description: "Message displayed for user not found.",
  },
  userUpdated: {
    defaultMessage: "User updated successfully!",
    id: "evxvnW",
    description:
      "Message displayed to user after user is updated successfully.",
  },
  veteranStatus: {
    defaultMessage: "Veteran status",
    id: "OVWo88",
    description: "Title for Veteran status",
  },
  priorityStatus: {
    defaultMessage: "Priority status",
    id: "+2PPS3",
    description: "Title for priority status",
  },
});

export default messages;
