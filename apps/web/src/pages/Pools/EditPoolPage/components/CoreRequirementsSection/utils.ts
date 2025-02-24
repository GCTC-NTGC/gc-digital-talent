import { empty } from "@gc-digital-talent/helpers";
import {
  LocalizedString,
  Maybe,
  Pool,
  PoolLanguage,
  SecurityStatus,
  UpdatePoolInput,
} from "@gc-digital-talent/graphql";

export enum LocationOption {
  RemoteOptional = "REMOTE_OPTIONAL",
  SpecificLocation = "SPECIFIC_LOCATION",
}

const getLocationOption = (isRemote: Maybe<boolean> | undefined) => {
  if (empty(isRemote) || isRemote) {
    return LocationOption.RemoteOptional;
  }

  return LocationOption.SpecificLocation;
};

export interface FormValues {
  languageRequirement?: PoolLanguage;
  securityRequirement?: SecurityStatus;
  locationOption: LocationOption;
  specificLocationEn?: LocalizedString["en"];
  specificLocationFr?: LocalizedString["fr"];
}

export const dataToFormValues = (initialData: Pool): FormValues => ({
  languageRequirement: initialData.language?.value,
  securityRequirement: initialData.securityClearance?.value,
  locationOption: getLocationOption(initialData.isRemote),
  specificLocationEn: initialData.location?.en,
  specificLocationFr: initialData.location?.fr,
});

export type CoreRequirementsSubmitData = Pick<
  UpdatePoolInput,
  "language" | "location" | "securityClearance" | "isRemote" | "publishingGroup"
>;

export const formValuesToSubmitData = (
  formValues: FormValues,
): CoreRequirementsSubmitData => {
  return {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    language: formValues.languageRequirement
      ? formValues.languageRequirement
      : undefined, // can't be set to null, assume not updating if empty
    location:
      formValues.locationOption !== LocationOption.RemoteOptional
        ? {
            en: formValues.specificLocationEn,
            fr: formValues.specificLocationFr,
          }
        : {
            en: null,
            fr: null,
          },
    isRemote: formValues.locationOption === LocationOption.RemoteOptional,
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    securityClearance: formValues.securityRequirement
      ? formValues.securityRequirement
      : undefined, // can't be set to null, assume not updating if empty
  };
};
