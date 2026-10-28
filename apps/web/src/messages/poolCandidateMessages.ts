import { defineMessages } from "react-intl";

const messages = defineMessages({
  expired: {
    defaultMessage: "Expired",
    id: "LYCaEd",
    description: "Simplified status label for expired recruitments",
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
    defaultMessage: "Application retained",
    id: "hWQgP5",
    description:
      "Message displayed when candidate has been screened in at a specific assessment step",
  },
  unsuccessful: {
    defaultMessage: "Unsuccessful",
    id: "TIAla1",
    description:
      "Message displayed when candidate has not passed an assessment step",
  },
  unclaimed: {
    defaultMessage: "Unclaimed",
    id: "N2/Y9w",
    description:
      "Message displayed when candidate has yet to be assessed at a specific assessment step for a skill that is non-essential",
  },
  assessmentStepNumber: {
    defaultMessage: "Step {stepNumber}",
    id: "6lcN/j",
    description: "Number of a specific step",
  },
  availableForReferral: {
    defaultMessage: "Available for referral",
    id: "ILThW5",
    description: "A candidate is being referred for new positions",
  },
});

export default messages;
