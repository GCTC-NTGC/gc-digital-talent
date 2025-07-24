import { defineMessage } from "react-intl";

const labels = {
  isEnabled: defineMessage({
    defaultMessage: "Enabled",
    id: "QpghXO",
    description: "A switch to enable or disable a setting",
  }),
  publishDateUtc: defineMessage({
    defaultMessage: "Publish date (UTC)",
    id: "5cll86",
    description:
      "A date at which data will be published, in the UTC time standard",
  }),
  publishDateLocal: defineMessage({
    defaultMessage: "Publish date (Local)",
    id: "DQ8q0K",
    description:
      "A date at which data will be published, in the local time zone",
  }),
  expiryDateUtc: defineMessage({
    defaultMessage: "Expiry date (UTC)",
    id: "j9zYRY",
    description: "A date at which data will expire, in the UTC time standard",
  }),
  expiryDateLocal: defineMessage({
    defaultMessage: "Expiry date (Local)",
    id: "KH3yb6",
    description: "A date at which data will expire, in the local time zone",
  }),
  message: defineMessage({
    defaultMessage: "Message",
    id: "Ms61e+",
    description: "The message",
  }),
} as const;

export default labels;
