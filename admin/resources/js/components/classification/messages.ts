import { defineMessages } from "react-intl";

export default defineMessages({
  createHeading: {
    id: "classification.form.createHeading",
    defaultMessage: "Create Classification",
    description: "Title displayed on the create a classification form.",
  },
  updateHeading: {
    id: "classification.form.updateHeading",
    defaultMessage: "Update Classification",
    description: "Title displayed on the update a classification form.",
  },
  keyLabel: {
    id: "classification.form.keyLabel",
    defaultMessage: "Key: ",
    description: "Label displayed on the classification form key field.",
  },
  nameEnLabel: {
    id: "classification.form.nameEnLabel",
    defaultMessage: "Name (English): ",
    description:
      "Label displayed on the classification form name (English) field.",
  },
  nameFrLabel: {
    id: "classification.form.nameFrLabel",
    defaultMessage: "Name (French): ",
    description:
      "Label displayed on the classification form name (French) field.",
  },
  levelLabel: {
    id: "classification.form.levelLabel",
    defaultMessage: "Level: ",
    description: "Label displayed on the classification form level field.",
  },
  levelPlaceholder: {
    id: "classification.form.levelPlaceholder",
    defaultMessage: "Select a level...",
    description:
      "Placeholder displayed on the classification form level field.",
  },
  groupLabel: {
    id: "classification.form.groupLabel",
    defaultMessage: "Group: ",
    description: "Label displayed for the classification form group field.",
  },
  minSalaryLabel: {
    id: "classification.form.minSalaryLabel",
    defaultMessage: "Minimum Salary: ",
    description:
      "Label displayed for the classification form min salary field.",
  },
  maxSalaryLabel: {
    id: "classification.form.maxSalaryLabel",
    defaultMessage: "Maximum Salary: ",
    description:
      "Label displayed for the classification form max salary field.",
  },
  createSuccess: {
    id: "classification.form.createSuccess",
    defaultMessage: "Classification created successfully!",
    description:
      "Message displayed to user after classification is created successfully.",
  },
  updateSuccess: {
    id: "classification.form.updateSuccess",
    defaultMessage: "Classification created successfully!",
    description:
      "Message displayed to user after classification is created successfully.",
  },
  createError: {
    id: "classification.form.createError",
    defaultMessage: "Error: creating classification failed",
    description:
      "Message displayed to user after classification fails to get created.",
  },
  updateError: {
    id: "classification.form.updateError",
    defaultMessage: "Error: updating classification failed",
    description:
      "Message displayed to user after classification fails to get updated.",
  },
  notFound: {
    id: "classification.form.notFound",
    defaultMessage: "Classification {classificationId} not found.",
    description: "Message displayed for classification not found.",
  },
});
