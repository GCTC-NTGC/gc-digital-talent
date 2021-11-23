import { defineMessages } from "react-intl";

export default defineMessages({
  createHeading: {
    defaultMessage: "Create Classification",
    description: "Title displayed on the create a classification form.",
  },
  updateHeading: {
    defaultMessage: "Update Classification",
    description: "Title displayed on the update a classification form.",
  },
  keyLabel: {
    defaultMessage: "Key:",
    description: "Label displayed on the classification form key field.",
  },
  nameEnLabel: {
    defaultMessage: "Name (English):",
    description:
      "Label displayed on the classification form name (English) field.",
  },
  nameFrLabel: {
    defaultMessage: "Name (French):",
    description:
      "Label displayed on the classification form name (French) field.",
  },
  levelLabel: {
    defaultMessage: "Level:",
    description: "Label displayed on the classification form level field.",
  },
  levelPlaceholder: {
    defaultMessage: "Select a level...",
    description:
      "Placeholder displayed on the classification form level field.",
  },
  groupLabel: {
    defaultMessage: "Group:",
    description: "Label displayed for the classification form group field.",
  },
  minSalaryLabel: {
    defaultMessage: "Minimum Salary:",
    description:
      "Label displayed for the classification form min salary field.",
  },
  maxSalaryLabel: {
    defaultMessage: "Maximum Salary:",
    description:
      "Label displayed for the classification form max salary field.",
  },
  createSuccess: {
    defaultMessage: "Classification created successfully!",
    description:
      "Message displayed to user after classification is created successfully.",
  },
  updateSuccess: {
    defaultMessage: "Classification updated successfully!",
    description:
      "Message displayed to user after classification is updated successfully.",
  },
  createError: {
    defaultMessage: "Error: creating classification failed",
    description:
      "Message displayed to user after classification fails to get created.",
  },
  updateError: {
    defaultMessage: "Error: updating classification failed",
    description:
      "Message displayed to user after classification fails to get updated.",
  },
  notFound: {
    defaultMessage: "Classification {classificationId} not found.",
    description: "Message displayed for classification not found.",
  },
});
