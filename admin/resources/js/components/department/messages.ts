import { defineMessages } from "react-intl";

export default defineMessages({
  createHeading: {
    id: "department.form.createHeading",
    defaultMessage: "Create Department",
    description: "Title displayed on the create a department form.",
  },
  updateHeading: {
    id: "department.form.updateHeading",
    defaultMessage: "Update Department",
    description: "Title displayed on the update a department form.",
  },
  departmentNumberLabel: {
    id: "department.form.keyLabel",
    defaultMessage: "Department #:",
    description:
      "Label displayed on the create a department form department number field.",
  },
  nameEnLabel: {
    id: "department.form.nameEnLabel",
    defaultMessage: "Name (English):",
    description:
      "Label displayed on the create a department form name (English) field.",
  },
  nameFrLabel: {
    id: "department.form.nameFrLabel",
    defaultMessage: "Name (French):",
    description:
      "Label displayed on the create a department form name (French) field.",
  },
  createSuccess: {
    id: "department.form.createSuccess",
    defaultMessage: "Department created successfully!",
    description:
      "Message displayed to user after department is created successfully.",
  },
  updateSuccess: {
    id: "department.form.updateSuccess",
    defaultMessage: "Department updated successfully!",
    description:
      "Message displayed to user after department is updated successfully.",
  },
  createError: {
    id: "department.form.createError",
    defaultMessage: "Error: creating department failed",
    description:
      "Message displayed to user after department fails to get created.",
  },
  updateError: {
    id: "department.form.updateError",
    defaultMessage: "Error: updating department failed",
    description:
      "Message displayed to user after department fails to get updated.",
  },
  notFound: {
    id: "department.form.notFound",
    defaultMessage: "Department {departmentId} not found.",
    description: "Message displayed for department not found.",
  },
});
