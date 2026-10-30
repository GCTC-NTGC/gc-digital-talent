import { defineMessage, type PrimitiveType } from "react-intl";

/**
 * Messages used in generic form components (@gc-digital-talent/forms)
 */
const formMessages = {
  submit: defineMessage({
    defaultMessage: "Submit",
    id: "YHqVoj",
    description: "Default text for submit button.",
  }),
  submitted: defineMessage({
    defaultMessage: "Submitted",
    id: "rGTGvl",
    description: "Default text for submitted button.",
  }),
  submitting: defineMessage({
    defaultMessage: "Submitting",
    id: "mDOWWQ",
    description: "Default text for submitting button.",
  }),
  wordLimit: defineMessage<{ wordCount: number; wordLimit: number }>({
    defaultMessage: "{wordCount} / {wordLimit} words",
    id: "YmboX1",
    description: "Message for words remaining before hitting the limit",
  }),
  unsavedTitle: defineMessage({
    defaultMessage: "You have unsaved changes",
    id: "9hjEsr",
    description: "Title for unsaved changes warning on profile forms",
  }),
  deselectCheck: defineMessage<{ label: string }>({
    defaultMessage: "Deselect {label}",
    id: "+6TuVe",
    description: "Text to uncheck checkbox button",
  }),
  selectCheck: defineMessage<{ label: string }>({
    defaultMessage: "Select {label}",
    id: "/SBJ7g",
    description: "Text to check checkbox button",
  }),
  resetCombobox: defineMessage({
    defaultMessage: "Clear your selection",
    id: "U/4a27",
    description: "Button text to reset the combobox input",
  }),
  toggleCombobox: defineMessage({
    defaultMessage: "Toggle options menu",
    id: "Ot5z0u",
    description: "Button text to toggle the combobox menu",
  }),
  noResultsCombobox: defineMessage({
    defaultMessage: "No results found.",
    id: "IRCKBP",
    description: "Message displayed when combobox has no options available",
  }),
  allAvailableCombobox: defineMessage<{ total: number }>({
    defaultMessage:
      "{total, plural, =0 {<strong>0</strong> available options} one {<strong>#</strong> available option} other {<strong>#</strong> available options}}",
    id: "X3wRqo",
    description:
      "Message showing number of all available options in combobox menu",
  }),
  subsetAvailableCombobox: defineMessage<{ total: number; count: number }>({
    defaultMessage:
      "{count, plural, =0 {<strong>0</strong> matching results} one {<strong>#</strong> matching result} other {<strong>#</strong> matching results}} out of {total, plural, =0 {<strong>0</strong> available options} one {<strong>#</strong> available option} other {<strong>#</strong> available options}}",
    id: "KeleaV",
    description:
      "Message showing number of matching items from all available options in combobox menu",
  }),
  itemsSelectedCombobox: defineMessage<{ count: number }>({
    defaultMessage:
      "{count, plural, =0 {0 options selected} one {# option selected} other {# options selected}}",
    id: "HxxE2u",
    description:
      "Message displayed telling user how many items they have selected in a multi-select combobox",
  }),
  clearSelectedCombobox: defineMessage({
    defaultMessage: "Clear all selections",
    id: "QnlRv0",
    description:
      "Button text to clear the current selected items in a multi-select combobox",
  }),
  saveChanges: defineMessage({
    defaultMessage: "Save changes",
    id: "WGoaKQ",
    description: "Text for submit button on edit forms",
  }),
  cancelGoBack: defineMessage({
    defaultMessage: "Cancel and go back",
    id: "fMcKtJ",
    description: "Text to cancel changes to a form",
  }),
  repeaterSkipTo: defineMessage({
    defaultMessage: "Skip to add an item",
    id: "sJ+F9z",
    description: "Link text to skip to the add button in a repeater",
  }),
  repeaterMove: defineMessage<{ from: number; to: number }>({
    defaultMessage: "Change order from {from} to {to}",
    id: "NVMKe5",
    description: "Button text for moving an item from one position to another",
  }),
  repeaterRemove: defineMessage<{ index: PrimitiveType }>({
    defaultMessage: "Remove item {index}",
    id: "T/97gk",
    description: "Button text to remove an item from repeatable fields",
  }),
  repeaterEdit: defineMessage<{ index: PrimitiveType }>({
    defaultMessage: "Edit item {index}",
    id: "Gz8vAO",
    description: "Button text to edit an item from repeatable fields",
  }),
  repeaterAnnounceMove: defineMessage<{ from: number; to: number }>({
    defaultMessage: "Item moved from {from} to {to}.",
    id: "PAXoFY",
    description:
      "Message announced to assistive technology when a repeatable field has moved position",
  }),
  repeaterAnnounceRemove: defineMessage<{ index: number }>({
    defaultMessage: "Item {index} removed.",
    id: "2G+fJt",
    description:
      "Message announced to assistive technology when a repeatable field has been removed",
  }),
  repeaterDefaultError: defineMessage({
    defaultMessage: "It looks like this list has an error.",
    id: "exPBiQ",
    description: "Error message title for repeater component.",
  }),
  repeaterDeleteItem: defineMessage({
    defaultMessage: "Delete an item to add another",
    id: "fO0cRR",
    description:
      "Message displayed when max items have been reached on repeater component.",
  }),
  repeaterAddItem: defineMessage({
    defaultMessage: "Add a new item",
    id: "OOVZSs",
    description: "Message displayed for add button on repeater component.",
  }),
  phonePlaceholder: defineMessage({
    defaultMessage: "+123243234",
    id: "uNArwM",
    description: "Placeholder for form telephone field",
  }),
  byDateDescending: defineMessage({
    defaultMessage: "By date (recent first)",
    id: "yuWHKJ",
    description: "Select the option to sort by date, descending",
  }),
  byTitleAscending: defineMessage({
    defaultMessage: "By title (alphabetically)",
    id: "J+0v2z",
    description: "Select the option to sort by title, ascending",
  }),
  allTypes: defineMessage({
    defaultMessage: "All types",
    id: "spoY2L",
    description: "Select the option to sort or filter by all types",
  }),
  identifyAs: defineMessage({
    defaultMessage: "Based on this definition, I identify as:",
    id: "sbmUVq",
    description:
      "Prompt text for a user selecting an employment equity group for their profile",
  }),
  candidateNotify: defineMessage({
    defaultMessage:
      "The candidate will be notified of any changes made in this form.",
    id: "17dZD4",
    description:
      "Caption notifying the user about who can know about the results of form changes",
  }),
  sortBy: defineMessage({
    defaultMessage: "Sort by",
    id: "W9SXxj",
    description: "Label for the links to change how the list is sorted",
  }),
  editDetails: defineMessage({
    defaultMessage: "Edit details",
    id: "DTw8xg",
    description: "Label for button to edit details",
  }),
};

export default formMessages;
