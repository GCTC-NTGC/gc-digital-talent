import { defineMessages } from "react-intl";

export default defineMessages({
  createHeading: {
    defaultMessage: "Create CMO Asset",
    description: "Title displayed on the create a cmo asset form.",
  },
  updateHeading: {
    defaultMessage: "Update CMO Asset",
    description: "Title displayed on the update a cmo asset form.",
  },
  keyLabel: {
    defaultMessage: "Key:",
    description: "Label displayed on the create a cmo asset form key field.",
  },
  nameEnLabel: {
    defaultMessage: "Name EN:",
    description:
      "Label displayed on the create a cmo asset form name (English) field.",
  },
  nameFrLabel: {
    defaultMessage: "Name FR:",
    description:
      "Label displayed on the create a cmo asset form name (French) field.",
  },
  descriptionEnLabel: {
    defaultMessage: "Description EN:",
    description:
      "Label displayed on the create a cmo asset form description (English) field.",
  },
  descriptionFrLabel: {
    defaultMessage: "Description FR:",
    description:
      "Label displayed on the create a cmo asset form description (French) field.",
  },
  createSuccess: {
    defaultMessage: "CMO Asset created successfully!",
    description:
      "Message displayed to user after cmo asset is created successfully.",
  },
  updateSuccess: {
    defaultMessage: "CMO Asset updated successfully!",
    description:
      "Message displayed to user after cmo asset is updated successfully.",
  },
  createError: {
    defaultMessage: "Error: creating cmo asset failed",
    description:
      "Message displayed to user after cmo asset fails to get created.",
  },
  updateError: {
    defaultMessage: "Error: updating cmo asset failed",
    description:
      "Message displayed to user after cmo asset fails to get updated.",
  },
  notFound: {
    defaultMessage: "CMO Asset {cmoAssetId} not found.",
    description: "Message displayed for cmo asset not found.",
  },
});
