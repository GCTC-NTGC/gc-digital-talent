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
  expiryDateUtc: defineMessage({
    defaultMessage: "Expiry date (UTC)",
    id: "j9zYRY",
    description: "A date at which data will expire, in the UTC time standard",
  }),
  messageEn: defineMessage({
    defaultMessage: "English - Message",
    id: "0Vjyzx",
    description: "The message, in English",
  }),
  messageFr: defineMessage({
    defaultMessage: "French - Message",
    id: "V/xaU2",
    description: "The message, in English",
  }),
} as const;

export default labels;
