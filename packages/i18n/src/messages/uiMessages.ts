import { defineMessage } from "react-intl";

/**
 * Messages used in generic ui components (@gc-digital-talent/ui)
 */
const uiMessages = {
  closeAlert: defineMessage({
    defaultMessage: "Close alert",
    id: "oGXgxJ",
    description: "Text for the close button on alerts",
  }),
  successAlert: defineMessage({
    defaultMessage: "Success alert:",
    id: "Ss95s5",
    description: "Descriptor for a success alert",
  }),
  warningAlert: defineMessage({
    defaultMessage: "Warning alert:",
    id: "6iZHGg",
    description: "Descriptor for a warning alert",
  }),
  errorAlert: defineMessage({
    defaultMessage: "Error alert:",
    id: "oSa0Aa",
    description: "Descriptor for an error alert",
  }),
  infoAlert: defineMessage({
    defaultMessage: "Info alert:",
    id: "vGENdP",
    description: "Descriptor for an info alert",
  }),
  breadcrumbs: defineMessage({
    defaultMessage: "Breadcrumbs",
    id: "0p1W7Q",
    description: "Label for the links to page ancestors",
  }),
  removeChip: defineMessage({
    defaultMessage: "Remove",
    id: "+6/qCF",
    description: "Button text for a dismissible chip",
  }),
  loadingResults: defineMessage({
    defaultMessage: "Loading results…",
    id: "0ieoVD",
    description:
      "Message to display when a search is currently loading results.",
  }),
  closeDialog: defineMessage({
    defaultMessage: "Close dialog",
    id: "g2X8Fx",
    description: "Text for the button to close a modal dialog.",
  }),
  newTab: defineMessage({
    defaultMessage: "(opens in new tab)",
    id: "OBQ8b9",
    description: "Text that appears in links that open in a new tab.",
  }),
  closeMenu: defineMessage({
    defaultMessage: "Close menu",
    id: "AiFpbo",
    description: "Text label for button that closes side menu.",
  }),
  openMenu: defineMessage({
    defaultMessage: "Open menu",
    id: "e6YQ8t",
    description: "Text label for button that opens side menu.",
  }),
  onThisPage: defineMessage({
    defaultMessage: "On this page",
    id: "3Nd6dv",
    description: "Title for  pages table of contents.",
  }),
  stepTitle: defineMessage<{ current: number; total: number }>({
    defaultMessage: "Step {current} of {total}",
    id: "WL3bq/",
    description:
      "Title for a list of steps indicating the current step of the total number of step",
  }),
  stepCompleted: defineMessage({
    defaultMessage: "Step completed, {label}",
    id: "Q6sBsq",
    description: "Prefix when a step has been completed.",
  }),
  stepError: defineMessage({
    defaultMessage: "Step error, {label}",
    id: "TJ7su7",
    description: "Prefix when a step has an error.",
  }),
  readMore: defineMessage<{ context: string }>({
    defaultMessage: "Read more<hidden> {context}</hidden>",
    id: "cCWdDX",
    description: "Button text to expand truncated text to view all contents",
  }),
  readLess: defineMessage<{ context: string }>({
    defaultMessage: "Read less<hidden> {context}</hidden>",
    id: "rnZULP",
    description: "Button text to truncate text to view fewer characters",
  }),
  confirmContinue: defineMessage({
    defaultMessage: "Do you wish to continue?",
    id: "ijGl5r",
    description: "A request to confirm that the user wants to continue",
  }),
  nullSelectionOption: defineMessage({
    defaultMessage: "Select an option",
    id: "fUF8rg",
    description: "Null selection for select input",
  }),
  expandAll: defineMessage({
    defaultMessage: "Expand all sections",
    id: "4WvSir",
    description: "Generic link text to expand all accordions in a section",
  }),
  collapseAll: defineMessage({
    defaultMessage: "Collapse all sections",
    id: "OeTCOs",
    description: "Generic link text to collapse all accordions in a section",
  }),
  nullSelectionOptionLevel: defineMessage({
    defaultMessage: "Select a level",
    id: "xEkbvy",
    description: "Null selection of level for select input",
  }),
  nullSelectionOptionGroup: defineMessage({
    defaultMessage: "Select a group",
    id: "nICORU",
    description: "Null selection og group for select input.",
  }),
  countAndTotal: defineMessage<{ count: number; total: number }>({
    defaultMessage: "({count}/{total})",
    id: "nqYfCF",
    description: "Label for count and total",
  }),
  loadingTitle: defineMessage({
    defaultMessage: "Loading",
    id: "o/6zAs",
    description: "Title displayed for a table initial loading state.",
  }),
  loadingError: defineMessage({
    defaultMessage: "Oh no…",
    id: "GtVkbt",
    description: "Title displayed for a table error loading state.",
  }),
  asterisk: defineMessage({
    defaultMessage: "*",
    id: "nSENOg",
    description: "Asterisk symbol",
  }),
  dismiss: defineMessage({
    defaultMessage: "Dismiss",
    id: "FO4QJP",
    description: "Label for action to dismiss something",
  }),
};

export default uiMessages;
