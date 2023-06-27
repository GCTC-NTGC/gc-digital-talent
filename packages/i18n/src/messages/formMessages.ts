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
  wordLimit: {
    defaultMessage: "{wordCount} / {wordLimit} words",
    id: "YmboX1",
    description: "Message for words remaining before hitting the limit",
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
  cancelGoBack: {
    defaultMessage: "Cancel and go back",
    id: "fMcKtJ",
    description: "Text to cancel changes to a form",
  },
  repeaterSkipTo: {
    defaultMessage: "Skip to add an item",
    id: "sJ+F9z",
    description: "Link text to skip to the add button in a repeater",
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
  defaultPlaceholder: {
    defaultMessage: "Select",
    id: "plwOsC",
    description:
      "Default placeholder shown when Select field has nothing actively selected.",
  },
  loading: {
    defaultMessage: "Loading...",
    id: "ylHC90",
    description:
      "Message shown in options dropdown when Select field is loading options.",
  },
  noOptions: {
    defaultMessage: "No options",
    id: "lsFH+y",
    description:
      "Message shown in options dropdown when Select field has no options.",
  },
  phonePlaceholder: {
    defaultMessage: "+123243234",
    id: "uNArwM",
    description: "Placeholder for form telephone field",
  },
  byDateDescending: {
    defaultMessage: "By date (recent first)",
    id: "yuWHKJ",
    description: "Select the option to sort by date, descending",
  },
  byTitleAscending: {
    defaultMessage: "By title (alphabetically)",
    id: "J+0v2z",
    description: "Select the option to sort by title, ascending",
  },
  allTypes: {
    defaultMessage: "All types",
    id: "spoY2L",
    description: "Select the option to sort or filter by all types",
  },
});

export default formMessages;
