import { defineMessages } from "react-intl";

const commonMessages = defineMessages({
  loadingTitle: {
    defaultMessage: "Loading...",
    id: "B7fcr5",
    description: "Title displayed for a table initial loading state.",
  },
  saving: {
    defaultMessage: "Saving...",
    id: "Tw90Pi",
    description: "Submitting text for save button.",
  },
  removing: {
    defaultMessage: "Removing...",
    id: "14Cv7d",
    description: "Submitting text for delete button.",
  },
  loadingError: {
    defaultMessage: "Oh no...",
    id: "AvBSV+",
    description: "Title displayed for a table error loading state.",
  },
  required: {
    defaultMessage: "Required",
    id: "Bvr4b6",
    description: "Displayed next to required form inputs.",
  },
  optional: {
    defaultMessage: "Optional",
    id: "WUC9pX",
    description: "Displayed next to optional form inputs.",
  },
  unSaved: {
    defaultMessage: "You have unsaved changes",
    id: "9u6ULg",
    description:
      "Displayed next to form inputs when they have been changed but not saved.",
  },
  notFound: {
    defaultMessage: "Not found",
    id: "ufSiRU",
    description: "Title displayed when an item cannot be found.",
  },
  notAvailable: {
    defaultMessage: "N/A",
    id: "r7x5H3",
    description:
      "Message displayed when specific information is not applicable",
  },
  requiredFieldsMissing: {
    defaultMessage: "There are <red>required</red> fields missing.",
    id: "EdAaI7",
    description: "Message that there are required fields missing",
  },
  nameNotLoaded: {
    defaultMessage: "Error: name not loaded",
    id: "DdOEWx",
    description: "Message when name value not found",
  },
});

export default commonMessages;
