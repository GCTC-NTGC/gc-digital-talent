import * as React from "react";
import TableOfContents from "@common/components/TableOfContents";
import {
  LocalizedString,
  PoolAdvertisement,
  PoolAdvertisementLanguage,
  SecurityStatus,
} from "@common/api/generated";
import { useIntl } from "react-intl";
import { Input, RadioGroup, Select, Submit } from "@common/components/form";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { enumToOptions } from "@common/helpers/formUtils";
import isEmpty from "lodash/isEmpty";
import {
  getLanguageRequirement,
  getSecurityClearance,
} from "@common/constants/localizedConstants";
import { SectionMetadata, Spacer } from "./EditPool";

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

interface OtherRequirementsSectionProps {
  poolAdvertisement: PoolAdvertisement;
  sectionMetadata: SectionMetadata;
  onSave: (submitData: unknown) => void;
}

export const OtherRequirementsSection = ({
  poolAdvertisement,
  sectionMetadata,
  onSave,
}: OtherRequirementsSectionProps): JSX.Element => {
  const intl = useIntl();

  const dataToFormValues = (initialData: PoolAdvertisement): FormValues => ({
    languageRequirement: initialData.advertisementLanguage,
    securityRequirement: initialData.securityClearance,
    locationOption:
      isEmpty(initialData.advertisementLocation?.en) &&
      isEmpty(initialData.advertisementLocation?.fr)
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

  return (
    <TableOfContents.Section id={sectionMetadata.id}>
      <TableOfContents.Heading>
        <h2 data-h2-margin="b(top, l)" data-h2-font-size="b(p)">
          {sectionMetadata.title}
        </h2>
      </TableOfContents.Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Select the requirements needed for this advertisement.",
          description:
            "Helper message for filling in the pool other requirements",
        })}
      </p>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSave)}>
          <div data-h2-display="b(flex)">
            <Spacer style={{ flex: 1 }}>
              <Select
                id="LanguageRequirement"
                label={intl.formatMessage({
                  defaultMessage: "Language requirement",
                  description:
                    "Label displayed on the edit pool form language requirement field.",
                })}
                name="LanguageRequirement"
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
              />
            </Spacer>
            <Spacer style={{ flex: 1 }} />
          </div>
          <div data-h2-display="b(flex)">
            <Spacer style={{ flex: 1 }}>
              <Select
                id="SecurityRequirement"
                label={intl.formatMessage({
                  defaultMessage: "Security requirement",
                  description:
                    "Label displayed on the edit pool form security requirement field.",
                })}
                name="SecurityRequirement"
                options={enumToOptions(SecurityStatus, [
                  SecurityStatus.Reliability,
                  SecurityStatus.Secret,
                  SecurityStatus.TopSecret,
                ]).map(({ value }) => ({
                  value,
                  label: intl.formatMessage(getSecurityClearance(value)),
                }))}
              />
            </Spacer>
            <Spacer style={{ flex: 1 }} />
          </div>
          <div data-h2-display="b(flex)">
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
              />
            </Spacer>
            <Spacer style={{ flex: 1 }} />
          </div>
          {locationOption === LocationOption.SpecificLocation ? (
            <>
              <div data-h2-display="b(flex)">
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
                  />
                </Spacer>
                <Spacer style={{ flex: 1 }} />
              </div>
              <div data-h2-display="b(flex)">
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
                  />
                </Spacer>
                <Spacer style={{ flex: 1 }} />
              </div>
            </>
          ) : undefined}
          <Submit
            text={intl.formatMessage({
              defaultMessage: "Save other requirements",
              description:
                "Text on a button to save the pool other requirements",
            })}
            color="cta"
            mode="solid"
          />
        </form>
      </FormProvider>
    </TableOfContents.Section>
  );
};

export default OtherRequirementsSection;
