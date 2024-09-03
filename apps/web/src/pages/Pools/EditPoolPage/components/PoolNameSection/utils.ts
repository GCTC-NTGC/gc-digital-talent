import { IntlShape } from "react-intl";

import { Option } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import {
  PoolOpportunityLength,
  Classification,
  LocalizedString,
  Maybe,
  Pool,
  PoolStream,
  PublishingGroup,
  UpdatePoolInput,
  Department,
  PoolAreaOfSelection,
  PoolSelectionLimitation,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  areaOfSelection?: Maybe<PoolAreaOfSelection>;
  selectionLimitations?: Maybe<PoolSelectionLimitation[]>;
  classification?: Classification["id"];
  department?: Department["id"];
  stream?: PoolStream;
  specificTitleEn?: LocalizedString["en"];
  specificTitleFr?: LocalizedString["fr"];
  processNumber?: string;
  publishingGroup?: Maybe<PublishingGroup>;
  opportunityLength?: Maybe<PoolOpportunityLength>;
}

export const dataToFormValues = (initialData: Pool): FormValues => ({
  areaOfSelection: initialData.areaOfSelection?.value ?? undefined,
  selectionLimitations: initialData.selectionLimitations?.map((l) => l.value),
  classification: initialData.classification?.id ?? "",
  department: initialData.department?.id ?? "",
  stream: initialData.stream?.value ?? undefined,
  specificTitleEn: initialData.name?.en ?? "",
  specificTitleFr: initialData.name?.fr ?? "",
  processNumber: initialData.processNumber ?? "",
  publishingGroup: initialData.publishingGroup?.value,
  opportunityLength: initialData.opportunityLength?.value,
});

export type PoolNameSubmitData = Pick<
  UpdatePoolInput,
  | "areaOfSelection"
  | "selectionLimitations"
  | "classification"
  | "department"
  | "name"
  | "stream"
  | "processNumber"
  | "publishingGroup"
  | "opportunityLength"
>;

export const formValuesToSubmitData = (
  formValues: FormValues,
): PoolNameSubmitData => ({
  areaOfSelection: formValues.areaOfSelection ?? undefined,
  selectionLimitations: formValues.selectionLimitations ?? undefined,
  classification: formValues.classification
    ? {
        connect: formValues.classification,
      }
    : undefined,
  department: formValues.department
    ? {
        connect: formValues.department,
      }
    : undefined,
  stream: formValues.stream ? formValues.stream : undefined,
  name: {
    en: formValues.specificTitleEn,
    fr: formValues.specificTitleFr,
  },
  processNumber: formValues.processNumber ? formValues.processNumber : null,
  publishingGroup: formValues.publishingGroup
    ? formValues.publishingGroup
    : undefined, // can't be set to null, assume not updating if empty
  opportunityLength: formValues.opportunityLength
    ? formValues.opportunityLength
    : null, // can't be set to null, assume not updating if empty
});

export const getClassificationOptions = (
  classifications: readonly Classification[],
  intl: IntlShape,
): Option[] => {
  return classifications.filter(notEmpty).map(({ id, group, level, name }) => ({
    value: id,
    label: `${group}-0${level} (${getLocalizedName(name, intl)})`,
  }));
};

export const getDepartmentOptions = (
  departments: readonly Pick<Department, "id" | "name">[],
  intl: IntlShape,
): Option[] => {
  return departments.filter(notEmpty).map(({ id, name }) => ({
    value: id,
    label: getLocalizedName(name, intl),
  }));
};
