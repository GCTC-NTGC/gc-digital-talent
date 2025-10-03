import { defineMessages } from "react-intl";

const messages = defineMessages({
  breadcrumb: {
    defaultMessage: "Registration",
    id: "H6FgWU",
    description: "Breadcrumb for the registration pages",
  },
  title: {
    defaultMessage: "Welcome to GC Digital Talent",
    id: "D0cHjz",
    description: "Page title for the registration pages",
  },
  subtitle: {
    defaultMessage: "Get started by completing your basic account information.",
    id: "g+tCWe",
    description: "Subtitle for the registration pages",
  },
  gettingStartedSectionTitle: {
    defaultMessage: "Getting started",
    id: "QXiUo/",
    description: "Main heading in getting started page.",
  },
} as const);

export default messages;
