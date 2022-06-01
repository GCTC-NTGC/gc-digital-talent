import { defineMessages } from "react-intl";

const messages = defineMessages({
  profileCompleted: {
    defaultMessage:
      "All required fields are complete. You can now change your status.",
    description: "Message displayed to user when user profile completed.",
  },
  updatingFailed: {
    defaultMessage: "Error: updating user failed",
    description: "Message displayed to user after user fails to get updated.",
  },
  userNotFound: {
    defaultMessage: "User not found.",
    description: "Message displayed for user not found.",
  },
  userUpdated: {
    defaultMessage: "User updated successfully!",
    description:
      "Message displayed to user after user is updated successfully.",
  },
});

export default messages;
