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
    defaultMessage: "Remove {label}",
    id: "rsxrMs",
    description: "Button text for a dismissible chip",
  },
  searching: {
    defaultMessage: "Searching...",
    id: "4l+gBD",
    description: "Message to display when a search is being done.",
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
    defaultMessage: "Close Menu",
    id: "+ZPD1J",
    description: "Text label for button that closes side menu.",
  },
  openMenu: {
    defaultMessage: "Open Menu",
    id: "KMSWLW",
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
});

export default uiMessages;
