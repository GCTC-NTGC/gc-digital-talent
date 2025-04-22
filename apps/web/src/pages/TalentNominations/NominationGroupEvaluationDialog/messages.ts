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
  advancementNominationDecisionNotApproved: {
    defaultMessage: "This nomination for advancement is not supported.",
    id: "nG1cQZ",
    description: "Label for advancement nomination is not approved",
  },
});
