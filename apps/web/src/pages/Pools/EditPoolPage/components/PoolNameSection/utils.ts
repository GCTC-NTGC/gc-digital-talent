import type {
  PoolOpportunityLength,
  Classification,
  LocalizedString,
  Pool,
  PublishingGroup,
  UpdatePoolInput,
  Department,
  PoolAreaOfSelection,
  PoolSelectionLimitation,
  WorkStream,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  areaOfSelection?: PoolAreaOfSelection | null;
  selectionLimitations?: PoolSelectionLimitation[] | null;
  classification?: Classification["id"];
  department?: Department["id"];
  stream?: WorkStream["id"];
  specificTitleEn?: LocalizedString["en"];
  specificTitleFr?: LocalizedString["fr"];
  publishingGroup?: PublishingGroup | null;
  opportunityLength?: PoolOpportunityLength | null;
}

export const dataToFormValues = (
  initialData: Pick<
    Pool,
    | "areaOfSelection"
    | "selectionLimitations"
    | "classification"
    | "department"
    | "workStream"
    | "name"
    | "publishingGroup"
    | "opportunityLength"
  >,
): FormValues => ({
  areaOfSelection: initialData.areaOfSelection?.value ?? undefined,
  selectionLimitations: initialData.selectionLimitations?.map((l) => l.value),
  classification: initialData.classification?.id ?? "",
  department: initialData.department?.id ?? "",
  stream: initialData.workStream?.id ?? undefined,
  specificTitleEn: initialData.name?.en ?? "",
  specificTitleFr: initialData.name?.fr ?? "",
  publishingGroup: initialData.publishingGroup?.value,
  opportunityLength: initialData.opportunityLength?.value,
});

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
