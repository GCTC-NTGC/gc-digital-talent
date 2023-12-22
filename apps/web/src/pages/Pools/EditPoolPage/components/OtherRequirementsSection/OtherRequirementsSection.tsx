import * as React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import InboxStackIcon from "@heroicons/react/24/outline/InboxStackIcon";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import {
  Input,
  RadioGroup,
  Select,
  Submit,
  enumToOptions,
} from "@gc-digital-talent/forms";
import {
  commonMessages,
  getLanguageRequirement,
  getSecurityClearance,
} from "@gc-digital-talent/i18n";

import { PoolStatus, PoolLanguage, SecurityStatus } from "~/api/generated";
import {
  hasAllEmptyFields,
  hasEmptyRequiredFields,
} from "~/validators/process/otherRequirements";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import processMessages from "~/messages/processMessages";

import { useEditPoolContext } from "../EditPoolContext";
import { SectionProps } from "../../types";
import Display from "./Display";
import {
  FormValues,
  LocationOption,
  OtherRequirementsSubmitData,
  dataToFormValues,
  formValuesToSubmitData,
} from "./utils";
import ActionWrapper from "../ActionWrapper";

type OtherRequirementsSectionProps = SectionProps<OtherRequirementsSubmitData>;

const OtherRequirementsSection = ({
  pool,
  sectionMetadata,
  onSave,
}: OtherRequirementsSectionProps): JSX.Element => {
  const intl = useIntl();
  const isNull = hasAllEmptyFields(pool);
  const emptyRequired = hasEmptyRequiredFields(pool);
  const { isSubmitting } = useEditPoolContext();
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull,
    emptyRequired,
    fallbackIcon: InboxStackIcon,
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(pool),
  });
  const { handleSubmit, control } = methods;
  const locationOption: FormValues["locationOption"] = useWatch({
    control,
    name: "locationOption",
  });

  const handleSave = async (formValues: FormValues) => {
    return onSave(formValuesToSubmitData(formValues))
      .then(() => {
        methods.reset(formValues, {
          keepDirty: false,
        });
        setIsEditing(false);
      })
      .catch(() => methods.reset(formValues));
  };

  // disabled unless status is draft
  const formDisabled = pool.status !== PoolStatus.Draft;

  const subtitle = intl.formatMessage({
    defaultMessage: "Select the requirements needed for this advertisement.",
    id: "T97G+I",
    description: "Describes selecting additional requirements for a process.",
  });

  return (
    <ToggleSection.Root
      id={`${sectionMetadata.id}-form`}
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Header
        Icon={icon.icon}
        color={icon.color}
        level="h3"
        size="h5"
        toggle={
          <ToggleForm.LabelledTrigger
            disabled={formDisabled}
            sectionTitle={sectionMetadata.title}
          />
        }
      >
        {sectionMetadata.title}
      </ToggleSection.Header>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <ToggleForm.NullDisplay
              title={sectionMetadata.id}
              content={subtitle}
            />
          ) : (
            <Display pool={pool} subtitle={subtitle} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <p>{subtitle}</p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x1 0)"
                data-h2-margin="base(x1 0)"
                data-h2-max-width="l-tablet(50%)"
              >
                <Select
                  id="languageRequirement"
                  label={intl.formatMessage(
                    processMessages.languageRequirement,
                  )}
                  name="languageRequirement"
                  nullSelection={intl.formatMessage({
                    defaultMessage: "Select a language requirement",
                    id: "7pCluO",
                    description: "Placeholder for language requirement field",
                  })}
                  options={enumToOptions(PoolLanguage, [
                    PoolLanguage.Various,
                    PoolLanguage.English,
                    PoolLanguage.French,
                    PoolLanguage.BilingualIntermediate,
                    PoolLanguage.BilingualAdvanced,
                  ]).map(({ value }) => ({
                    value,
                    label: intl.formatMessage(getLanguageRequirement(value)),
                  }))}
                  disabled={formDisabled}
                />
                <Select
                  id="securityRequirement"
                  label={intl.formatMessage(
                    processMessages.securityRequirement,
                  )}
                  name="securityRequirement"
                  nullSelection={intl.formatMessage({
                    defaultMessage: "Select a security requirement",
                    id: "PVo1xK",
                    description: "Placeholder for security requirement field",
                  })}
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
                <RadioGroup
                  idPrefix="locationOption"
                  legend={intl.formatMessage(processMessages.location)}
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
                {locationOption === LocationOption.SpecificLocation ? (
                  <>
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
                  </>
                ) : undefined}
              </div>

              <ActionWrapper>
                {!formDisabled && (
                  <Submit
                    text={intl.formatMessage({
                      defaultMessage: "Save other requirements",
                      id: "66MUMB",
                      description:
                        "Text on a button to save the pool other requirements",
                    })}
                    color="secondary"
                    mode="solid"
                    isSubmitting={isSubmitting}
                  />
                )}
                <ToggleSection.Close>
                  <Button mode="inline" type="button" color="quaternary">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </ToggleSection.Close>
              </ActionWrapper>
            </form>
          </FormProvider>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default OtherRequirementsSection;
export type { OtherRequirementsSubmitData };
