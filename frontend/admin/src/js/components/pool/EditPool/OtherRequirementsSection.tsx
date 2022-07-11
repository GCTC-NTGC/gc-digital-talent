import * as React from "react";
import TableOfContents from "@common/components/TableOfContents";
import {
  LocalizedString,
  PoolAdvertisement,
  PoolAdvertisementLanguage,
  SecurityStatus,
} from "@common/api/generated";
import { useIntl } from "react-intl";
import { Select, Submit, TextArea } from "@common/components/form";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import WordCounter from "@common/components/WordCounter/WordCounter";
import { countNumberOfWords, enumToOptions } from "@common/helpers/formUtils";
import { errorMessages } from "@common/messages";
import isEmpty from "lodash/isEmpty";
import {
  getLanguageRequirement,
  getSecurityClearance,
  languageRequirements,
} from "@common/constants/localizedConstants";
import { SectionMetadata, Spacer } from "./EditPool";

type FormValues = {
  LanguageRequirement: PoolAdvertisement["advertisementLanguage"];
  SecurityRequirement: PoolAdvertisement["securityClearance"];
  LocationOption: "REMOTE_OPTIONAL" | "SPECIFIC_LOCATION";
  SpecificLocationEn?: LocalizedString["en"];
  SpecificLocationFr?: LocalizedString["fr"];
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
    LanguageRequirement: initialData.advertisementLanguage,
    SecurityRequirement: initialData.securityClearance,
    LocationOption:
      isEmpty(initialData.advertisementLocation?.en) &&
      isEmpty(initialData.advertisementLocation?.fr)
        ? "REMOTE_OPTIONAL"
        : "SPECIFIC_LOCATION",
    SpecificLocationEn: initialData.advertisementLocation?.en,
    SpecificLocationFr: initialData.advertisementLocation?.fr,
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(poolAdvertisement),
  });
  const { handleSubmit, control } = methods;
  const watchYourWorkEn: FormValues["LocationOption"] = useWatch({
    control,
    name: "LocationOption",
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
