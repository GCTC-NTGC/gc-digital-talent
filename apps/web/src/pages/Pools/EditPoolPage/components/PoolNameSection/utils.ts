import type {
  PoolOpportunityLength,
  LocalizedString,
  PublishingGroup,
  UpdatePoolInput,
  PoolAreaOfSelection,
  PoolSelectionLimitation,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  areaOfSelection?: PoolAreaOfSelection | null;
  selectionLimitations?: PoolSelectionLimitation[] | null;
  classification?: string;
  department?: string;
  stream?: string;
  specificTitleEn?: LocalizedString["en"];
  specificTitleFr?: LocalizedString["fr"];
  publishingGroup?: PublishingGroup | null;
  opportunityLength?: PoolOpportunityLength | null;
}

export type PoolNameSubmitData = Pick<
  UpdatePoolInput,
  | "areaOfSelection"
  | "selectionLimitations"
  | "classification"
  | "name"
  | "workStream"
  | "publishingGroup"
  | "opportunityLength"
>;

export const formValuesToSubmitData = (
  formValues: FormValues,
): PoolNameSubmitData => ({
  areaOfSelection: formValues.areaOfSelection,
  selectionLimitations: formValues.selectionLimitations ?? [],
  classification: formValues.classification
    ? {
        connect: formValues.classification,
      }
    : undefined,
  workStream: formValues.stream ? { connect: formValues.stream } : undefined,
  name: {
    en: formValues.specificTitleEn,
    fr: formValues.specificTitleFr,
  },
  publishingGroup: formValues.publishingGroup ?? undefined, // can't be set to null, assume not updating if empty
  opportunityLength: formValues.opportunityLength ?? undefined, // can't be set to null, assume not updating if empty
});
