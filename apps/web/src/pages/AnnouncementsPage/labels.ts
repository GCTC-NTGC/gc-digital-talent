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
  titleEn: defineMessage({
    defaultMessage: "English - Title",
    id: "Ng7dwm",
    description: "The title, in English",
  }),
  titleFr: defineMessage({
    defaultMessage: "French - Title",
    id: "sC8mrj",
    description: "The title, in French",
  }),
  messageEn: defineMessage({
    defaultMessage: "English - Message",
    id: "0Vjyzx",
    description: "The message, in English",
  }),
  messageFr: defineMessage({
    defaultMessage: "French - Message",
    id: "/k2RKP",
    description: "The message, in French",
  }),
} as const;

export default labels;
