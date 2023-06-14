import { defineMessages } from "react-intl";

const messages = defineMessages({
  qualified: {
    defaultMessage: "Qualified",
    id: "OdfEyd",
    description: "Simplified status label for qualified recruitments",
  },
  expired: {
    defaultMessage: "Expired",
    id: "LYCaEd",
    description: "Simplified status label for expired recruitments",
  },
  placedAvailability: {
    defaultMessage:
      "Congrats! As you were hired from this recruitment, you will no longer receive opportunities related to it.",
    id: "cVWREE",
    description:
      "Message displayed when an applicant has been placed as a result of a recruitment",
  },
  expiredAvailability: {
    defaultMessage:
      "This recruitment has expired and it is no longer available for hiring opportunities.",
    id: "kekvz1",
    description:
      "Message displayed when an applicant application to a recruitment has expired and no longer available",
  },
  suspendedAvailability: {
    defaultMessage:
      "You are not receiving opportunities from this recruitment.",
    id: "eKPE3F",
    description:
      "Message displayed when a user has suspended an application to a recruitment",
  },
  openAvailability: {
    defaultMessage: "You are open to opportunities from this recruitment.",
    id: "uIWFvk",
    description: "Message displayed when a user is appearing in a recruitment",
  },
  ongoingRecruitment: {
    defaultMessage: "Ongoing recruitment",
    id: "Uxw5DB",
    description: "Label for an ongoing qualified recruitment",
  },
  targetedRecruitment: {
    defaultMessage: "Targeted recruitment",
    id: "04smVa",
    description: "Label for an targeting (active) qualified recruitment",
  },
});

export default messages;
