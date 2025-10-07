import { defineMessage, MessageDescriptor } from "react-intl";

import { EmailType } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

export const descriptions: Record<EmailType, MessageDescriptor> = {
  WORK: defineMessage({
    defaultMessage:
      "To verify your work email, the domain must match a known Government of Canada email pattern (e.g. @canada.ca, @department.gc.ca, etc.).",
    id: "cw6MTQ",
    description: "Work email title paragraph",
  }),
  CONTACT: defineMessage({
    defaultMessage:
      "This email will be used by recruitment and HR teams to contact you about opportunities, as well as to send notifications about your applications and other platform details.",
    id: "fa+z9W",
    description: "Contact email title paragraph",
  }),
};

export const labels: Record<EmailType, MessageDescriptor> = {
  WORK: commonMessages.workEmail,
  CONTACT: commonMessages.email,
};


