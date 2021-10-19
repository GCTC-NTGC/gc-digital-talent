import { defineMessages } from "react-intl";

export default defineMessages({
  createHeading: {
    defaultMessage: "Create Department",
    description: "Title displayed on the create a department form.",
  },
  updateHeading: {
    defaultMessage: "Update Department",
    description: "Title displayed on the update a department form.",
  },
  departmentNumberLabel: {
    defaultMessage: "Department #:",
    description:
      "Label displayed on the create a department form department number field.",
  },
  nameEnLabel: {
    defaultMessage: "Name (English):",
    description:
      "Label displayed on the create a department form name (English) field.",
  },
  nameFrLabel: {
    defaultMessage: "Name (French):",
    description:
      "Label displayed on the create a department form name (French) field.",
  },
  createSuccess: {
    defaultMessage: "Department created successfully!",
    description:
      "Message displayed to user after department is created successfully.",
  },
  updateSuccess: {
    defaultMessage: "Department updated successfully!",
    description:
      "Message displayed to user after department is updated successfully.",
  },
  createError: {
    defaultMessage: "Error: creating department failed",
    description:
      "Message displayed to user after department fails to get created.",
  },
  updateError: {
    defaultMessage: "Error: updating department failed",
    description:
      "Message displayed to user after department fails to get updated.",
  },
  notFound: {
    defaultMessage: "Department {departmentId} not found.",
    description: "Message displayed for department not found.",
  },
});
