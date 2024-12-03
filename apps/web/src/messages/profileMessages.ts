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
  contractDuration: {
    defaultMessage: "Employment duration preference",
    id: "TfEUPu",
    description:
      "Legend Text for required work preferences options in work preferences form",
  },
  anyDuration: {
    defaultMessage: "Any duration (short term, long term, indeterminate)",
    id: "ohQoWa",
    description:
      "Label displayed on Work Preferences form for any duration option",
  },
  permanentDuration: {
    defaultMessage: "Indeterminate (permanent only)",
    id: "aB5p3B",
    description:
      "Label displayed on Work Preferences form for indeterminate duration option.",
  },
  acceptableRequirements: {
    defaultMessage: "Acceptable job requirements",
    id: "6UgbrG",
    description:
      "Legend for optional work preferences check list in work preferences form",
  },
  currentLocation: {
    defaultMessage: "Current location",
    id: "v9A5Cb",
    description: "Legend for users current location",
  },
});

export default messages;
