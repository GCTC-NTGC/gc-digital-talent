import { defineMessages } from "react-intl";

export default defineMessages({
  createHeading: {
    defaultMessage: "Create Pool",
    description: "Title displayed on the create a pool form.",
  },
  updateHeading: {
    defaultMessage: "Update Pool",
    description: "Title displayed on the update a pool form.",
  },
  ownerLabel: {
    defaultMessage: "Owner:",
    description: "Label displayed on the pool form owner field.",
  },
  ownerPlaceholder: {
    defaultMessage: "Select an owner...",
    description: "Placeholder displayed on the pool form owner field.",
  },
  nameLabelEn: {
    defaultMessage: "Name (English):",
    description: "Label displayed on the pool form name (English) field.",
  },
  nameLabelFr: {
    defaultMessage: "Name (French):",
    description: "Label displayed on the pool form name (French) field.",
  },
  keyLabel: {
    defaultMessage: "Key:",
    description: "Label displayed on the 'key' input field.",
  },
  keyContext: {
    defaultMessage:
      "The 'key' is a string that uniquely identifies a Pool. It should be based on the Pool's English name, and it should be concise. A good example would be \"digital_careers\". It may be used in the code to refer to this particular Pool, so it cannot be changed later.",
    description:
      "Additional context describing the purpose of the Pool's 'key' field.",
  },
  keyPattern: {
    defaultMessage: "Please use only lowercase letters and underscores.",
  },
  descriptionLabelEn: {
    defaultMessage: "Description (English):",
    description:
      "Label displayed on the pool form description (English) field.",
  },
  descriptionLabelFr: {
    defaultMessage: "Description (French):",
    description: "Label displayed on the pool form description (French) field.",
  },
  assetCriteriaLabel: {
    defaultMessage: "Asset Criteria:",
    description: "Label displayed on the pool form asset criteria field.",
  },
  assetCriteriaPlaceholder: {
    defaultMessage: "Select one or more asset...",
    description: "Placeholder displayed on the pool form asset criteria field.",
  },
  classificationsLabel: {
    defaultMessage: "Classifications:",
    description: "Label displayed on the pool form classifications field.",
  },
  classificationsPlaceholder: {
    defaultMessage: "Select one or more classifications...",
    description:
      "Placeholder displayed on the pool form classifications field.",
  },
  essentialCriteriaLabel: {
    defaultMessage: "Essential Criteria:",
    description: "Label displayed on the pool form essential criteria field.",
  },
  essentialCriteriaPlaceholder: {
    defaultMessage: "Select one or more essential...",
    description:
      "Placeholder displayed on the pool form essential criteria field.",
  },
  operationalRequirementsLabel: {
    defaultMessage: "Operational Requirements:",
    description:
      "Label displayed on the pool form operational requirements field.",
  },
  operationalRequirementsPlaceholder: {
    defaultMessage: "Select one or more operational requirements...",
    description:
      "Placeholder displayed on the pool form operational requirements field.",
  },
  createSuccess: {
    defaultMessage: "Pool created successfully!",
    description:
      "Message displayed to user after pool is created successfully.",
  },
  updateSuccess: {
    defaultMessage: "Pool updated successfully!",
    description:
      "Message displayed to user after pool is updated successfully.",
  },
  createError: {
    defaultMessage: "Error: creating pool failed",
    description: "Message displayed to pool after pool fails to get created.",
  },
  updateError: {
    defaultMessage: "Error: updating pool failed",
    description: "Message displayed to pool after pool fails to get updated.",
  },
  notFound: {
    defaultMessage: "Pool {poolId} not found.",
    description: "Message displayed for pool not found.",
  },
});
