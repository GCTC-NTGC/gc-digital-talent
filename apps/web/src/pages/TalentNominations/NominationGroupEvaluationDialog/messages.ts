import { defineMessages } from "react-intl";

export const dialogMessages = defineMessages({
  title: {
    defaultMessage: "Submit the evaluation of this nomination",
    id: "3I3F9y",
    description: "Title for dialog to evaluate a nomination group",
  },
  subtitle: {
    defaultMessage:
      "Record the decision on whether this nomination has been approved for talent management.",
    id: "po01Az",
    description: "Subtitle for dialog to evaluate a nomination group",
  },
});

export const formMessages = defineMessages({
  decisionNullState: {
    defaultMessage:
      "Please select the evaluation of this nomination to continue.",
    id: "Bb9Pe0",
    description:
      "Prompt for the user to evaluate the nomination before continuing",
  },
  advancementReferenceWorkEmail: {
    defaultMessage: "Reference’s work email",
    id: "aqlXBz",
    description: "Reference work email field",
  },
  advancementNominationDecisionLabel: {
    defaultMessage: "Advancement approval",
    id: "MHQ2RT",
    description: "Label for an nomination for advancement decision",
  },
  advancementNominationDecisionApproved: {
    defaultMessage: "This nomination for advancement is approved.",
    id: "lgp1Jx",
    description: "Label for advancement nomination is approved",
  },
  advancementNominationDecisionRejected: {
    defaultMessage: "This nomination for advancement is not supported.",
    id: "QiQoIq",
    description: "Label for advancement nomination is rejected",
  },
  referenceConfirmationLabel: {
    defaultMessage: "Reference confirmation",
    id: "By8ofA",
    description: "Confirmation that the reference was checked",
  },
  referenceConfirmationStatement: {
    defaultMessage:
      "I’ve confirmed this nominee’s eligibility by contacting the secondary reference provided by the nominator.",
    id: "FcHUIQ",
    description: "Statement of confirmation for reference check",
  },
  approvalNotes: {
    defaultMessage: "Additional notes",
    id: "h9XSU5",
    description: "Label for approval notes",
  },
  rejectionNotes: {
    defaultMessage: "Reason for not supporting this nomination",
    id: "9gklPf",
    description: "label for rejection notes",
  },
  lateralMovementNominationDecisionLabel: {
    defaultMessage: "Lateral movement approval",
    id: "D7/cN1",
    description: "Label for an nomination for lateral movement decision",
  },
  lateralMovementNominationDecisionApproved: {
    defaultMessage: "This nomination for lateral movement is approved.",
    id: "We0XLh",
    description: "Label for lateral movement nomination is approved",
  },
  lateralMovementNominationDecisionRejected: {
    defaultMessage: "This nomination for lateral movement is not supported.",
    id: "kzmlCw",
    description: "Label for lateral movement nomination is rejected",
  },
  developmentProgramsNominationDecisionLabel: {
    defaultMessage: "Development programs approval",
    id: "RA4afJ",
    description: "Label for an nomination for development programs decision",
  },
  developmentProgramsNominationDecisionApproved: {
    defaultMessage: "This nomination for development programs is approved.",
    id: "UBOv+U",
    description: "Label for development programs nomination is approved",
  },
  developmentProgramsNominationDecisionRejected: {
    defaultMessage:
      "This nomination for development programs is not supported.",
    id: "X5xhRt",
    description: "Label for development programs nomination is rejected",
  },
  submissionSuccessful: {
    defaultMessage: "Evaluation submission successful",
    id: "y5Pf0S",
    description: "Submission success in evaluation dialog",
  },
  submissionFailed: {
    defaultMessage: "Evaluation submission failed",
    id: "kTM8Gi",
    description: "Submission failure in evaluation dialog",
  },
  nominatedTrue: {
    defaultMessage: "nominated",
    id: "HdezJB",
    description: "Status item in a nomination list, true",
  },
  nominatedFalse: {
    defaultMessage: "not nominated",
    id: "bBqAnz",
    description: "Status item in a nomination list, false",
  },
});
