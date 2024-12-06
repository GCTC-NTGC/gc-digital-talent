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
  holdForAssessment: {
    defaultMessage: "Hold for assessment",
    id: "ndW6vI",
    description:
      "Message displayed when candidate is on hold at a specific assessment step",
  },
  pendingDecision: {
    defaultMessage: "Pending decision",
    id: "Jzhd0N",
    description:
      "Message displayed when candidate is qualified or disqualified according to assessment results, but a final decision is yet to be made.",
  },
  disqualified: {
    defaultMessage: "Disqualified",
    id: "/dy2CX",
    description: "Message displayed when candidate has been disqualified",
  },
  notPlaced: {
    defaultMessage: "Not placed",
    id: "Qw+rrl",
    description:
      "Messaged displayed when a user is qualified but has yet to be placed",
  },
  successful: {
    defaultMessage: "Successful",
    id: "Whq2Xl",
    description:
      "Message displayed when candidate has successfully passed an assessment step",
  },
  screenedIn: {
    defaultMessage: "Screened in",
    id: "3W/NbE",
    description:
      "Message displayed when candidate has been screened in at a specific assessment step",
  },
  unsuccessful: {
    defaultMessage: "Unsuccessful",
    id: "TIAla1",
    description:
      "Message displayed when candidate has not passed an assessment step",
  },
  onHold: {
    defaultMessage: "On hold",
    id: "qA8+f5",
    description:
      "Message displayed when candidate was unsuccessful but put on hold",
  },
  unclaimed: {
    defaultMessage: "Unclaimed",
    id: "N2/Y9w",
    description:
      "Message displayed when candidate has yet to be assessed at a specific assessment step for a skill that is non-essential",
  },
});

export default messages;
