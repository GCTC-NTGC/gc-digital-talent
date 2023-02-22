import * as React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { TableOfContents } from "@gc-digital-talent/ui";
import {
  Input,
  RadioGroup,
  Select,
  Submit,
  enumToOptions,
} from "@gc-digital-talent/forms";
import {
  getLanguageRequirement,
  getPublishingGroup,
  getSecurityClearance,
} from "@gc-digital-talent/i18n";
import { empty } from "@gc-digital-talent/helpers";

import {
  AdvertisementStatus,
  LocalizedString,
  Maybe,
  PoolAdvertisement,
  PoolAdvertisementLanguage,
  PublishingGroup,
  SecurityStatus,
  UpdatePoolAdvertisementInput,
} from "~/api/generated";
import { EditPoolSectionMetadata } from "~/types/pool";
import Spacer from "~/components/Spacer/Spacer";

import { useEditPoolContext } from "./EditPoolContext";

enum LocationOption {
  RemoteOptional = "REMOTE_OPTIONAL",
  SpecificLocation = "SPECIFIC_LOCATION",
}

type FormValues = {
  languageRequirement: PoolAdvertisement["advertisementLanguage"];
  securityRequirement: PoolAdvertisement["securityClearance"];
  locationOption: LocationOption;
  specificLocationEn?: LocalizedString["en"];
  specificLocationFr?: LocalizedString["fr"];
  publishingGroup: Maybe<PublishingGroup>;
};

export type OtherRequirementsSubmitData = Pick<
  UpdatePoolAdvertisementInput,
  | "advertisementLanguage"
  | "advertisementLocation"
  | "securityClearance"
  | "isRemote"
  | "publishingGroup"
>;

interface OtherRequirementsSectionProps {
  poolAdvertisement: PoolAdvertisement;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: (submitData: OtherRequirementsSubmitData) => void;
}

const OtherRequirementsSection = ({
  poolAdvertisement,
  sectionMetadata,
  onSave,
}: OtherRequirementsSectionProps): JSX.Element => {
  const intl = useIntl();
  const { isSubmitting } = useEditPoolContext();

  const getLocationOption = (isRemote: Maybe<boolean>) => {
    if (empty(isRemote) || isRemote) {
      return LocationOption.RemoteOptional;
    }

    return LocationOption.SpecificLocation;
  };

  const dataToFormValues = (initialData: PoolAdvertisement): FormValues => ({
    languageRequirement: initialData.advertisementLanguage,
    securityRequirement: initialData.securityClearance,
    locationOption: getLocationOption(initialData.isRemote),
    specificLocationEn: initialData.advertisementLocation?.en,
    specificLocationFr: initialData.advertisementLocation?.fr,
    publishingGroup: initialData.publishingGroup,
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(poolAdvertisement),
  });
  const { handleSubmit, control } = methods;
  const locationOption: FormValues["locationOption"] = useWatch({
    control,
    name: "locationOption",
  });

  // disabled unless status is draft
  const formDisabled =
    poolAdvertisement.advertisementStatus !== AdvertisementStatus.Draft;

  const formValuesToSubmitData = (formValues: FormValues) => {
    // when the location option is "Remote Optional" then specific locations are not used
    if (formValues.locationOption === LocationOption.RemoteOptional) {
      return {
        ...formValues,
        specificLocationEn: null,
        specificLocationFr: null,
      };
    }
    return formValues;
  };

  const handleSave = (formValues: FormValues) => {
    onSave({
      advertisementLanguage: formValues.languageRequirement
        ? formValues.languageRequirement
        : undefined, // can't be set to null, assume not updating if empty
      advertisementLocation:
        formValues.locationOption !== LocationOption.RemoteOptional
          ? {
              en: formValues.specificLocationEn,
              fr: formValues.specificLocationFr,
            }
          : null,
      isRemote: formValues.locationOption === LocationOption.RemoteOptional,
      securityClearance: formValues.securityRequirement
        ? formValues.securityRequirement
        : undefined, // can't be set to null, assume not updating if empty
      publishingGroup: formValues.publishingGroup
        ? formValues.publishingGroup
        : undefined, // can't be set to null, assume not updating if empty
    });

    methods.reset(formValues, {
      keepDirty: false,
    });
  };

  return (
    <TableOfContents.Section id={sectionMetadata.id}>
      <TableOfContents.Heading data-h2-margin="base(x3, 0, x1, 0)">
        {sectionMetadata.title}
      </TableOfContents.Heading>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "Select the requirements needed for this advertisement.",
          id: "xlsfRu",
          description:
            "Helper message for filling in the pool other requirements",
        })}
      </p>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit((formValues) =>
            handleSave(formValuesToSubmitData(formValues)),
          )}
        >
          <div data-h2-display="base(flex)">
            <Spacer style={{ flex: 1 }}>
              <Select
                id="languageRequirement"
                label={intl.formatMessage({
                  defaultMessage: "Language requirement",
                  id: "nMYWzb",
                  description:
                    "Label displayed on the edit pool form language requirement field.",
                })}
                name="languageRequirement"
                options={enumToOptions(PoolAdvertisementLanguage, [
                  PoolAdvertisementLanguage.Various,
                  PoolAdvertisementLanguage.English,
                  PoolAdvertisementLanguage.French,
                  PoolAdvertisementLanguage.BilingualIntermediate,
                  PoolAdvertisementLanguage.BilingualAdvanced,
                ]).map(({ value }) => ({
                  value,
                  label: intl.formatMessage(getLanguageRequirement(value)),
                }))}
                disabled={formDisabled}
              />
            </Spacer>
            <Spacer style={{ flex: 1 }} />
          </div>
          <div data-h2-display="base(flex)">
            <Spacer style={{ flex: 1 }}>
              <Select
                id="securityRequirement"
                label={intl.formatMessage({
                  defaultMessage: "Security requirement",
                  id: "ASNC88",
                  description:
                    "Label displayed on the edit pool form security requirement field.",
                })}
                name="securityRequirement"
                options={enumToOptions(SecurityStatus, [
                  SecurityStatus.Reliability,
                  SecurityStatus.Secret,
                  SecurityStatus.TopSecret,
                ]).map(({ value }) => ({
                  value,
                  label: intl.formatMessage(getSecurityClearance(value)),
                }))}
                disabled={formDisabled}
              />
            </Spacer>
            <Spacer style={{ flex: 1 }} />
          </div>
          <div data-h2-display="base(flex)">
            <Spacer style={{ flex: 1 }}>
              <RadioGroup
                idPrefix="locationOption"
                legend={intl.formatMessage({
                  defaultMessage: "Location",
                  id: "UGaZR2",
                  description: "Location options in Edit Pool Form",
                })}
                name="locationOption"
                id="locationOption"
                items={[
                  {
                    value: LocationOption.RemoteOptional,
                    label: intl.formatMessage({
                      defaultMessage: "Remote optional (Recommended)",
                      id: "jphtnM",
                      description:
                        "Label displayed for 'remote optional' option",
                    }),
                  },
                  {
                    value: LocationOption.SpecificLocation,
                    label: intl.formatMessage({
                      defaultMessage: "Specific location (Specify below)",
                      id: "j3m2Ca",
                      description:
                        "Label displayed for 'specific location' option",
                    }),
                  },
                ]}
                disabled={formDisabled}
              />
            </Spacer>
            <Spacer style={{ flex: 1 }} />
          </div>
          {locationOption === LocationOption.SpecificLocation ? (
            <>
              <div data-h2-display="base(flex)">
                <Spacer style={{ flex: 1 }}>
                  <Input
                    id="specificLocationEn"
                    name="specificLocationEn"
                    type="text"
                    label={intl.formatMessage({
                      defaultMessage: "Specific Location (English)",
                      id: "A2VzLX",
                      description:
                        "Label for a pool advertisements specific English Location",
                    })}
                    disabled={formDisabled}
                  />
                </Spacer>
                <Spacer style={{ flex: 1 }} />
              </div>
              <div data-h2-display="base(flex)">
                <Spacer style={{ flex: 1 }}>
                  <Input
                    id="specificLocationFr"
                    name="specificLocationFr"
                    type="text"
                    label={intl.formatMessage({
                      defaultMessage: "Specific Location (French)",
                      id: "PH+6C9",
                      description:
                        "Label for a pool advertisements specific French Location",
                    })}
                    disabled={formDisabled}
                  />
                </Spacer>
                <Spacer style={{ flex: 1 }} />
              </div>
            </>
          ) : undefined}
          <div data-h2-display="base(flex)">
            <Spacer style={{ flex: 1 }}>
              <Select
                id="publishingGroup"
                label={intl.formatMessage({
                  defaultMessage: "Publishing group",
                  id: "tQ674x",
                  description:
                    "Label displayed on the edit pool form publishing group field.",
                })}
                name="publishingGroup"
                options={enumToOptions(PublishingGroup).map(({ value }) => ({
                  value,
                  label: intl.formatMessage(getPublishingGroup(value)),
                  ariaLabel: intl
                    .formatMessage(getPublishingGroup(value))
                    .replace(
                      intl.locale === "en" ? "IT" : "TI",
                      intl.locale === "en" ? "I T" : "T I",
                    ),
                }))}
                disabled={formDisabled}
              />
            </Spacer>
            <Spacer style={{ flex: 1 }} />
          </div>

          {!formDisabled && (
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Save other requirements",
                id: "66MUMB",
                description:
                  "Text on a button to save the pool other requirements",
              })}
              color="cta"
              mode="solid"
              isSubmitting={isSubmitting}
            />
          )}
        </form>
      </FormProvider>
    </TableOfContents.Section>
  );
};

export default OtherRequirementsSection;
