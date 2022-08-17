import * as React from "react";
import TableOfContents from "@common/components/TableOfContents";
import { useIntl } from "react-intl";
import { Input, RadioGroup, Select, Submit } from "@common/components/form";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { enumToOptions } from "@common/helpers/formUtils";
import {
  getLanguageRequirement,
  getSecurityClearance,
} from "@common/constants/localizedConstants";
import {
  AdvertisementStatus,
  LocalizedString,
  PoolAdvertisement,
  PoolAdvertisementLanguage,
  SecurityStatus,
  UpdatePoolAdvertisementInput,
} from "../../../api/generated";
import { SectionMetadata, Spacer } from "./EditPool";
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
};

export type OtherRequirementsSubmitData = Pick<
  UpdatePoolAdvertisementInput,
  | "advertisementLanguage"
  | "advertisementLocation"
  | "securityClearance"
  | "isRemote"
>;

interface OtherRequirementsSectionProps {
  poolAdvertisement: PoolAdvertisement;
  sectionMetadata: SectionMetadata;
  onSave: (submitData: OtherRequirementsSubmitData) => void;
}

export const OtherRequirementsSection = ({
  poolAdvertisement,
  sectionMetadata,
  onSave,
}: OtherRequirementsSectionProps): JSX.Element => {
  const intl = useIntl();
  const { isSubmitting } = useEditPoolContext();

  const dataToFormValues = (initialData: PoolAdvertisement): FormValues => ({
    languageRequirement: initialData.advertisementLanguage,
    securityRequirement: initialData.securityClearance,
    locationOption: initialData.isRemote
      ? LocationOption.RemoteOptional
      : LocationOption.SpecificLocation,
    specificLocationEn: initialData.advertisementLocation?.en,
    specificLocationFr: initialData.advertisementLocation?.fr,
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
      advertisementLanguage: formValues.languageRequirement,
      advertisementLocation:
        formValues.locationOption !== LocationOption.RemoteOptional
          ? {
              en: formValues.specificLocationEn,
              fr: formValues.specificLocationFr,
            }
          : null,
      isRemote: formValues.locationOption === LocationOption.RemoteOptional,
      securityClearance: formValues.securityRequirement,
    });
  };

  return (
    <TableOfContents.Section id={sectionMetadata.id}>
      <TableOfContents.Heading>
        <h2 data-h2-margin="base(x3, 0, x1, 0)" data-h2-font-size="base(p)">
          {sectionMetadata.title}
        </h2>
      </TableOfContents.Heading>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "Select the requirements needed for this advertisement.",
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
                  description: "Location options in Edit Pool Form",
                })}
                name="locationOption"
                items={[
                  {
                    value: LocationOption.RemoteOptional,
                    label: intl.formatMessage({
                      defaultMessage: "Remote optional (Recommended)",
                      description:
                        "Label displayed for 'remote optional' option",
                    }),
                  },
                  {
                    value: LocationOption.SpecificLocation,
                    label: intl.formatMessage({
                      defaultMessage: "Specific location (Specify below)",
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

          {!formDisabled && (
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Save other requirements",
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
