import { defineMessages } from "react-intl";

export default defineMessages({
  createHeading: {
    id: "pool.form.createHeading",
    defaultMessage: "Create Pool",
    description: "Title displayed on the create a pool form.",
  },
  updateHeading: {
    id: "pool.form.updateHeading",
    defaultMessage: "Update Pool",
    description: "Title displayed on the update a pool form.",
  },
  ownerLabel: {
    id: "pool.form.ownerLabel",
    defaultMessage: "Owner:",
    description: "Label displayed on the pool form owner field.",
  },
  ownerPlaceholder: {
    id: "pool.form.ownerPlaceholder",
    defaultMessage: "Select an owner...",
    description: "Placeholder displayed on the pool form owner field.",
  },
  nameLabelEn: {
    id: "pool.form.nameLabelEn",
    defaultMessage: "Name (English):",
    description: "Label displayed on the pool form name (English) field.",
  },
  nameLabelFr: {
    id: "pool.form.nameLabelFr",
    defaultMessage: "Name (French):",
    description: "Label displayed on the pool form name (French) field.",
  },
  descriptionLabelEn: {
    id: "pool.form.descriptionLabelEn",
    defaultMessage: "Description (English):",
    description:
      "Label displayed on the pool form description (English) field.",
  },
  descriptionLabelFr: {
    id: "pool.form.descriptionLabelFr",
    defaultMessage: "Description (French):",
    description: "Label displayed on the pool form description (French) field.",
  },
  assetCriteriaLabel: {
    id: "pool.form.assetCriteriaLabel",
    defaultMessage: "Asset Criteria:",
    description: "Label displayed on the pool form asset criteria field.",
  },
  assetCriteriaPlaceholder: {
    id: "pool.form.assetCriteriaPlaceholder",
    defaultMessage: "Select one or more asset...",
    description: "Placeholder displayed on the pool form asset criteria field.",
  },
  classificationsLabel: {
    id: "pool.form.classificationsLabel",
    defaultMessage: "Classifications:",
    description: "Label displayed on the pool form classifications field.",
  },
  classificationsPlaceholder: {
    id: "pool.form.classificationsPlaceholder",
    defaultMessage: "Select one or more classifications...",
    description:
      "Placeholder displayed on the pool form classifications field.",
  },
  essentialCriteriaLabel: {
    id: "pool.form.essentialCriteriaLabel",
    defaultMessage: "Essential Criteria:",
    description: "Label displayed on the pool form essential criteria field.",
  },
  essentialCriteriaPlaceholder: {
    id: "pool.form.essentialCriteriaPlaceholder",
    defaultMessage: "Select one or more essential...",
    description:
      "Placeholder displayed on the pool form essential criteria field.",
  },
  operationalRequirementsLabel: {
    id: "pool.form.operationalRequirementsLabel",
    defaultMessage: "Operational Requirements:",
    description:
      "Label displayed on the pool form operational requirements field.",
  },
  operationalRequirementsPlaceholder: {
    id: "pool.form.operationalRequirementsPlaceholder",
    defaultMessage: "Select one or more operational requirements...",
    description:
      "Placeholder displayed on the pool form operational requirements field.",
  },
  createSuccess: {
    id: "pool.form.createSuccess",
    defaultMessage: "Pool created successfully!",
    description:
      "Message displayed to user after pool is created successfully.",
  },
  updateSuccess: {
    id: "pool.form.updateSuccess",
    defaultMessage: "Pool updated successfully!",
    description:
      "Message displayed to user after pool is updated successfully.",
  },
  createError: {
    id: "pool.form.createError",
    defaultMessage: "Error: creating pool failed",
    description: "Message displayed to pool after pool fails to get created.",
  },
  updateError: {
    id: "pool.form.updateError",
    defaultMessage: "Error: updating pool failed",
    description: "Message displayed to pool after pool fails to get updated.",
  },
  notFound: {
    id: "pool.form.notFound",
    defaultMessage: "Pool {poolId} not found.",
    description: "Message displayed for pool not found.",
  },
});
