import { defineMessages } from "react-intl";

/**
 * Messages used in generic form components (@gc-digital-talent/forms)
 */
const formMessages = defineMessages({
  toggleContext: {
    defaultMessage: "Toggle context",
    id: "2W9CMn",
    description: "Label to toggle the context description of a field set.",
  },
  submit: {
    defaultMessage: "Submit",
    id: "YHqVoj",
    description: "Default text for submit button.",
  },
  submitted: {
    defaultMessage: "Submitted",
    id: "rGTGvl",
    description: "Default text for submitted button.",
  },
  submitting: {
    defaultMessage: "Submitting",
    id: "mDOWWQ",
    description: "Default text for submitting button.",
  },
  wordsOver: {
    defaultMessage:
      "{wordsLeft, plural, one {word over limit} other {words over limit}}.",
    id: "WPJrmN",
    description: "Message for when user goes over word limit.",
  },
  wordsLeft: {
    defaultMessage: "{wordsLeft, plural, one {word left} other {words left}}.",
    id: "j6WJBY",
    description: "Message for when user goes over word limit.",
  },
  overLimit: {
    defaultMessage: "You are over the word limit, {wordLimit}.",
    id: "JHgARn",
    description:
      "Text read out to assistive technology when over the word limit.",
  },
  unsavedTitle: {
    defaultMessage: "You have unsaved changes",
    id: "9hjEsr",
    description: "Title for unsaved changes warning on profile forms",
  },
  deselectCheck: {
    defaultMessage: "Deselect {label}",
    id: "+6TuVe",
    description: "Text to uncheck checkbox button",
  },
  selectCheck: {
    defaultMessage: "Select {label}",
    id: "/SBJ7g",
    description: "Text to check checkbox button",
  },
  resetCombobox: {
    defaultMessage: "Reset {label}",
    id: "b3ar1X",
    description: "Button text to reset the combobox input",
  },
  noResultsCombobox: {
    defaultMessage: "No results found.",
    id: "IRCKBP",
    description: "Message displayed when combobox has no options available",
  },
  saveChanges: {
    defaultMessage: "Save changes",
    id: "WGoaKQ",
    description: "Text for submit button on edit forms",
  },
  repeaterMove: {
    defaultMessage: "Change order from {from} to {to}",
    id: "NVMKe5",
    description: "Button text for moving an item from one position to another",
  },
  repeaterRemove: {
    defaultMessage: "Remove item {index}",
    id: "T/97gk",
    description: "Button text to remove an item from repeatable fields",
  },
  repeaterAnnounceMove: {
    defaultMessage: "Item moved from {from} to {to}.",
    id: "PAXoFY",
    description:
      "Message announced to assistive technology when a repeatable field has moved position",
  },
  repeaterAnnounceRemove: {
    defaultMessage: "Item {index} removed.",
    id: "2G+fJt",
    description:
      "Message announced to assistive technology when a repeatable field has been removed",
  },
});

export default formMessages;
