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
  titleEn: defineMessage({
    defaultMessage: "Title (English)",
    id: "MHZ1CD",
    description: "The title, in English",
  }),
  titleFr: defineMessage({
    defaultMessage: "Title (French)",
    id: "55Me4a",
    description: "The title, in French",
  }),
  messageEn: defineMessage({
    defaultMessage: "Message (English)",
    id: "XD0OVN",
    description: "The message, in English",
  }),
  messageFr: defineMessage({
    defaultMessage: "Message (French)",
    id: "ZTlEei",
    description: "The message, in French",
  }),
} as const;

export default labels;
