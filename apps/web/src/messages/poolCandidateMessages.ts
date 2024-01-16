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
  toAssess: {
    defaultMessage: "To assess",
    id: "/+naWC",
    description:
      "Message displayed when candidate has yet to be assessed at a specific assessment step",
  },
  disqualified: {
    defaultMessage: "Disqualified",
    id: "/dy2CX",
    description: "Message displayed when candidate has been disqualified",
  },
  removed: {
    defaultMessage: "Removed",
    id: "NNWQdp",
    description: "Message displayed when candidate has been removed",
  },
  notPlaced: {
    defaultMessage: "Not placed",
    id: "Qw+rrl",
    description:
      "Messaged displayed when a user is qualified but has yet to be placed",
  },
});

export default messages;
