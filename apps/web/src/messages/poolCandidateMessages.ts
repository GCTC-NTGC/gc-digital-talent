import { defineMessage, type PrimitiveType } from "react-intl";

const messages = {
  expired: defineMessage({
    defaultMessage: "Expired",
    id: "LYCaEd",
    description: "Simplified status label for expired recruitments",
  }),
  toAssess: defineMessage({
    defaultMessage: "To assess",
    id: "/+naWC",
    description:
      "Message displayed when candidate has yet to be assessed at a specific assessment step",
  }),
  holdForAssessment: defineMessage({
    defaultMessage: "Hold for assessment",
    id: "ndW6vI",
    description:
      "Message displayed when candidate is on hold at a specific assessment step",
  }),
  notPlaced: defineMessage({
    defaultMessage: "Not placed",
    id: "Qw+rrl",
    description:
      "Messaged displayed when a user is qualified but has yet to be placed",
  }),
  successful: defineMessage({
    defaultMessage: "Successful",
    id: "Whq2Xl",
    description:
      "Message displayed when candidate has successfully passed an assessment step",
  }),
  screenedIn: defineMessage({
    defaultMessage: "Application retained",
    id: "hWQgP5",
    description:
      "Message displayed when candidate has been screened in at a specific assessment step",
  }),
  unsuccessful: defineMessage({
    defaultMessage: "Unsuccessful",
    id: "TIAla1",
    description:
      "Message displayed when candidate has not passed an assessment step",
  }),
  unclaimed: defineMessage({
    defaultMessage: "Unclaimed",
    id: "N2/Y9w",
    description:
      "Message displayed when candidate has yet to be assessed at a specific assessment step for a skill that is non-essential",
  }),
  assessmentStepNumber: defineMessage<{ stepNumber: PrimitiveType }>({
    defaultMessage: "Step {stepNumber}",
    id: "6lcN/j",
    description: "Number of a specific step",
  }),
  availableForReferral: defineMessage({
    defaultMessage: "Available for referral",
    id: "ILThW5",
    description: "A candidate is being referred for new positions",
  }),
};

export default messages;
