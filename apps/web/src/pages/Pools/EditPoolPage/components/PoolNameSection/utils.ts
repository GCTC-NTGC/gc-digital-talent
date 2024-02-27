import { IntlShape } from "react-intl";

import { Option, enumToOptions } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  getLocalizedName,
  getPoolStream,
  getPoolOpportunityLength,
} from "@gc-digital-talent/i18n";
import {
  PoolOpportunityLength,
  Classification,
  LocalizedString,
  Maybe,
  Pool,
  PoolStream,
  PublishingGroup,
  Scalars,
  UpdatePoolInput,
} from "@gc-digital-talent/graphql";
import { alphaSortOptions } from "@gc-digital-talent/forms/src/utils";

import { sortedOpportunityLengths } from "~/utils/poolUtils";

const firstId = (
  collection: Maybe<Maybe<Classification>[]> | undefined,
): Scalars["ID"]["output"] | undefined => {
  if (!collection) return undefined;

  if (collection.length < 1) return undefined;

  return collection[0]?.id;
};

export type FormValues = {
  classification?: Classification["id"];
  stream?: PoolStream;
  specificTitleEn?: LocalizedString["en"];
  specificTitleFr?: LocalizedString["fr"];
  processNumber?: string;
  publishingGroup?: Maybe<PublishingGroup>;
  opportunityLength?: Maybe<PoolOpportunityLength>;
};

export const dataToFormValues = (initialData: Pool): FormValues => ({
  classification: firstId(initialData.classifications), // behavior is undefined when there is more than one
  stream: initialData.stream ?? undefined,
  specificTitleEn: initialData.name?.en ?? "",
  specificTitleFr: initialData.name?.fr ?? "",
  processNumber: initialData.processNumber ?? "",
  publishingGroup: initialData.publishingGroup,
  opportunityLength: initialData.opportunityLength,
});

export type PoolNameSubmitData = Pick<
  UpdatePoolInput,
  | "classifications"
  | "name"
  | "stream"
  | "processNumber"
  | "publishingGroup"
  | "opportunityLength"
>;

export const formValuesToSubmitData = (
  formValues: FormValues,
): PoolNameSubmitData => ({
  classifications: {
    sync: formValues.classification ? [formValues.classification] : [],
  },
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
  classifications: Maybe<Classification>[],
  intl: IntlShape,
): Option[] => {
  return alphaSortOptions(
    classifications.filter(notEmpty).map(({ id, group, level, name }) => ({
      value: id,
      label: `${group}-0${level} (${getLocalizedName(name, intl)})`,
    })),
  );
};

export const getStreamOptions = (intl: IntlShape): Option[] => {
  return enumToOptions(PoolStream).map(({ value }) => ({
    value,
    label: intl.formatMessage(getPoolStream(value)),
  }));
};

export const getOpportunityLengthOptions = (intl: IntlShape): Option[] => {
  return sortedOpportunityLengths.map((value) => ({
    value,
    label: intl.formatMessage(getPoolOpportunityLength(value)),
  }));
};
