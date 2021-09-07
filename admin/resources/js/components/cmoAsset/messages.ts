import { defineMessages } from "react-intl";

export default defineMessages({
  createHeading: {
    id: "cmoAsset.form.createHeading",
    defaultMessage: "Create CMO Asset",
    description: "Title displayed on the create a cmo asset form.",
  },
  updateHeading: {
    id: "cmoAsset.form.updateHeading",
    defaultMessage: "Update CMO Asset",
    description: "Title displayed on the update a cmo asset form.",
  },
  keyLabel: {
    id: "cmoAsset.form.keyLabel",
    defaultMessage: "Key:",
    description: "Label displayed on the create a cmo asset form key field.",
  },
  nameEnLabel: {
    id: "cmoAsset.form.nameEnLabel",
    defaultMessage: "Name EN:",
    description:
      "Label displayed on the create a cmo asset form name (English) field.",
  },
  nameFrLabel: {
    id: "cmoAsset.form.nameFrLabel",
    defaultMessage: "Name FR:",
    description:
      "Label displayed on the create a cmo asset form name (French) field.",
  },
  descriptionEnLabel: {
    id: "cmoAsset.form.descriptionEnLabel",
    defaultMessage: "Description EN:",
    description:
      "Label displayed on the create a cmo asset form description (English) field.",
  },
  descriptionFrLabel: {
    id: "cmoAsset.form.descriptionFrLabel",
    defaultMessage: "Description FR:",
    description:
      "Label displayed on the create a cmo asset form description (French) field.",
  },
  createSuccess: {
    id: "cmoAsset.form.createSuccess",
    defaultMessage: "CMO Asset created successfully!",
    description:
      "Message displayed to user after cmo asset is created successfully.",
  },
  updateSuccess: {
    id: "cmoAsset.form.updateSuccess",
    defaultMessage: "CMO Asset updated successfully!",
    description:
      "Message displayed to user after cmo asset is updated successfully.",
  },
  createError: {
    id: "cmoAsset.form.createError",
    defaultMessage: "Error: creating cmo asset failed",
    description:
      "Message displayed to user after cmo asset fails to get created.",
  },
  updateError: {
    id: "cmoAsset.form.updateError",
    defaultMessage: "Error: updating cmo asset failed",
    description:
      "Message displayed to user after cmo asset fails to get updated.",
  },
  notFound: {
    id: "cmoAsset.form.notFound",
    defaultMessage: "CMO Asset {cmoAssetId} not found.",
    description: "Message displayed for cmo asset not found.",
  },
});
