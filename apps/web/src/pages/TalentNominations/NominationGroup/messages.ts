import { defineMessages } from "react-intl";

import adminMessages from "~/messages/adminMessages";

export const detailTabMessages = defineMessages({
  nominationDetailsPageTitle: {
    defaultMessage: "Nomination details",
    id: "MsiKO0",
    description: "Link text for details about a nomination",
  },
  collapseNominations: {
    defaultMessage: "Collapse all<hidden> nominations</hidden>",
    id: "BH5pJe",
    description: "Button label to collapse all nominations",
  },
  expandNominations: {
    defaultMessage: "Expand all<hidden> nominations</hidden>",
    id: "KIQzbR",
    description: "Button label to expand all nominations",
  },
});

export const formMessages = {
  ...defineMessages({
    lateralMovementOptions: {
      defaultMessage: "Lateral experience recommendations",
      id: "syqHHS",
      description: "Label for the lateral movement options",
    },
    rationale: {
      defaultMessage: "Rationale",
      id: "IgniT6",
      description: "Link text for rationale step of a talent nomination",
    },
  }),
  developmentPrograms: adminMessages.developmentOpportunitiesRecommended,
};
