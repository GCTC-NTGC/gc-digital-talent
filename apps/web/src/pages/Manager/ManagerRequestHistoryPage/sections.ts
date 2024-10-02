import { defineMessage } from "react-intl";

const sections = {
  activeRequests: {
    id: "active-requests",
    title: defineMessage({
      defaultMessage: "Active requests",
      id: "pUTg70",
      description:
        "Title of the 'active requests' section of the manager request history page",
    }),
  },
  requestHistory: {
    id: "request-history",
    title: defineMessage({
      defaultMessage: "Request history",
      id: "iD2JB6",
      description:
        "Title of the 'request history' section of the manager request history page",
    }),
  },
} as const;

export default sections;
