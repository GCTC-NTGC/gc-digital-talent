import { defineMessage, type PrimitiveType } from "react-intl";

export const messages = {
  pageTitle: defineMessage({
    defaultMessage: "Add a community",
    id: "lyJ0Ft",
    description: "Title for the create community interest page",
  }),
  pageSubtitle: defineMessage({
    defaultMessage:
      "Express your interest in a functional community to receive recruitment, training, and promotional opportunities",
    id: "znVQXm",
    description: "Subtitle for the community interest pages",
  }),
  longPageTitle: defineMessage<{ communityName: PrimitiveType }>({
    defaultMessage: "Edit your interest in the {communityName}",
    id: "BtRBiU",
    description: "Long title for the edit community interest page",
  }),
  shortPageTitle: defineMessage({
    defaultMessage: "Edit a community",
    id: "tL6hvG",
    description: "Short title for the edit community interest page",
  }),
};
