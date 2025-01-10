import { defineMessages } from "react-intl";

/**
 * Messages used in generic ui components (@gc-digital-talent/ui)
 */
const uiMessages = defineMessages({
  closeAlert: {
    defaultMessage: "Close alert",
    id: "oGXgxJ",
    description: "Text for the close button on alerts",
  },
  successAlert: {
    defaultMessage: "Success alert:",
    id: "Ss95s5",
    description: "Descriptor for a success alert",
  },
  warningAlert: {
    defaultMessage: "Warning alert:",
    id: "6iZHGg",
    description: "Descriptor for a warning alert",
  },
  errorAlert: {
    defaultMessage: "Error alert:",
    id: "oSa0Aa",
    description: "Descriptor for an error alert",
  },
  infoAlert: {
    defaultMessage: "Info alert:",
    id: "vGENdP",
    description: "Descriptor for an info alert",
  },
  breadcrumbs: {
    defaultMessage: "Breadcrumbs",
    id: "0p1W7Q",
    description: "Label for the links to page ancestors",
  },
  removeChip: {
    defaultMessage: "Remove",
    id: "+6/qCF",
    description: "Button text for a dismissible chip",
  },
  searching: {
    defaultMessage: "Searching...",
    id: "4l+gBD",
    description: "Message to display when a search is being done.",
  },
  loadingResults: {
    defaultMessage: "Loading results...",
    id: "QRXLf/",
    description:
      "Message to display when a search is currently loading results.",
  },
  closeDialog: {
    defaultMessage: "Close dialog",
    id: "g2X8Fx",
    description: "Text for the button to close a modal dialog.",
  },
  newTab: {
    defaultMessage: "(opens in new tab)",
    id: "OBQ8b9",
    description: "Text that appears in links that open in a new tab.",
  },
  closeMenu: {
    defaultMessage: "Close menu",
    id: "AiFpbo",
    description: "Text label for button that closes side menu.",
  },
  openMenu: {
    defaultMessage: "Open menu",
    id: "e6YQ8t",
    description: "Text label for button that opens side menu.",
  },
  onThisPage: {
    defaultMessage: "On this page",
    id: "3Nd6dv",
    description: "Title for  pages table of contents.",
  },
  stepTitle: {
    defaultMessage: "Step {current} of {total}",
    id: "WL3bq/",
    description:
      "Title for a list of steps indicating the current step of the total number of step",
  },
  stepCompleted: {
    defaultMessage: "<hidden>Step completed, </hidden>{label}",
    id: "9zyjjw",
    description: "Prefix when a step has been completed.",
  },
  stepError: {
    defaultMessage: "<hidden>Step error, </hidden>{label}",
    id: "sfQN9S",
    description: "Prefix when a step has an error.",
  },
  stepActive: {
    defaultMessage: "<hidden>Step, current, </hidden>{label}",
    id: "0bcof1",
    description: "Prefix when a step is the currently active one.",
  },
  readMore: {
    defaultMessage: "Read more<hidden> {context}</hidden>",
    id: "cCWdDX",
    description: "Button text to expand truncated text to view all contents",
  },
  readLess: {
    defaultMessage: "Read less<hidden> {context}</hidden>",
    id: "rnZULP",
    description: "Button text to truncate text to view fewer characters",
  },
  confirmContinue: {
    defaultMessage: "Do you wish to continue?",
    id: "ijGl5r",
    description: "A request to confirm that the user wants to continue",
  },
  nullSelectionOption: {
    defaultMessage: "Select an option",
    id: "fUF8rg",
    description: "Null selection for select input",
  },
  expandAll: {
    defaultMessage: "Expand all sections",
    id: "4WvSir",
    description: "Generic link text to expand all accordions in a section",
  },
  collapseAll: {
    defaultMessage: "Collapse all sections",
    id: "OeTCOs",
    description: "Generic link text to collapse all accordions in a section",
  },
  nullSelectionOptionLevel: {
    defaultMessage: "Select a level",
    id: "xEkbvy",
    description: "Null selection of level for select input",
  },
  nullSelectionOptionGroup: {
    defaultMessage: "Select a group",
    id: "nICORU",
    description: "Null selection og group for select input.",
  },
});

export default uiMessages;
