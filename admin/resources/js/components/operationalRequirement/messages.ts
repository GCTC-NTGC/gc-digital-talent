import { defineMessages } from "react-intl";

export default defineMessages({
  createHeading: {
    defaultMessage: "Create Operational Requirement",
    description:
      "Title displayed on the create a operational requirement form.",
  },
  updateHeading: {
    defaultMessage: "Update Operational Requirement",
    description:
      "Title displayed on the update a operational requirement form.",
  },
  keyLabel: {
    defaultMessage: "Key:",
    description:
      "Label displayed on the operational requirement form key field.",
  },
  nameLabelEn: {
    defaultMessage: "Name (English):",
    description:
      "Label displayed on the operational requirement form name (English) field.",
  },
  nameLabelFr: {
    defaultMessage: "Name (French):",
    description:
      "Label displayed on the operational requirement form name (French) field.",
  },
  descriptionLabelEn: {
    defaultMessage: "Description (English):",
    description:
      "Label displayed on the operational requirement form description (English) field.",
  },
  descriptionLabelFr: {
    defaultMessage: "Description (French):",
    description:
      "Label displayed on the operational requirement form description (French) field.",
  },
  createSuccess: {
    defaultMessage: "Operational Requirement created successfully!",
    description:
      "Message displayed to user after operational requirement is created successfully.",
  },
  updateSuccess: {
    defaultMessage: "Operational Requirement updated successfully!",
    description:
      "Message displayed to user after operational requirement is updated successfully.",
  },
  createError: {
    defaultMessage: "Error: creating operational requirement failed",
    description:
      "Message displayed to user after operational requirement fails to get created.",
  },
  updateError: {
    defaultMessage: "Error: updating operational requirement failed",
    description:
      "Message displayed to user after operational requirement fails to get updated.",
  },
  operationalRequirementNotFound: {
    defaultMessage:
      "Operational Requirement {operationalRequirementId} not found.",
    description: "Message displayed for operational requirement not found.",
  },
});
