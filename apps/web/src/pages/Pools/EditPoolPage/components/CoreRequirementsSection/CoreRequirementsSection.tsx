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
  formMessages,
  getLanguageRequirement,
  getSecurityClearance,
} from "@gc-digital-talent/i18n";
import {
  PoolStatus,
  PoolLanguage,
  SecurityStatus,
  graphql,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";

import {
  hasAllEmptyFields,
  hasEmptyRequiredFields,
} from "~/validators/process/coreRequirements";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import processMessages from "~/messages/processMessages";

import { useEditPoolContext } from "../EditPoolContext";
import { SectionProps } from "../../types";
import Display from "./Display";
import {
  FormValues,
  LocationOption,
  CoreRequirementsSubmitData,
  dataToFormValues,
  formValuesToSubmitData,
} from "./utils";
import ActionWrapper from "../ActionWrapper";

const EditPoolCoreRequirements_Fragment = graphql(/* GraphQL */ `
  fragment EditPoolCoreRequirements on Pool {
    id
    status
    language
    securityClearance
    isRemote
    location {
      en
      fr
    }
  }
`);

type CoreRequirementsSectionProps = SectionProps<
  CoreRequirementsSubmitData,
  FragmentType<typeof EditPoolCoreRequirements_Fragment>
>;

const CoreRequirementsSection = ({
  poolQuery,
  sectionMetadata,
  onSave,
}: CoreRequirementsSectionProps): JSX.Element => {
  const intl = useIntl();
  const pool = getFragment(EditPoolCoreRequirements_Fragment, poolQuery);
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
    defaultMessage:
      "This section covers requirements such as remote work, on-site locations, language and security.",
    id: "LKZV/V",
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
        level="h2"
        size="h3"
        toggle={
          <ToggleForm.LabelledTrigger
            disabled={formDisabled}
            sectionTitle={sectionMetadata.title}
          />
        }
      >
        {sectionMetadata.title}
      </ToggleSection.Header>
      <p>{subtitle}</p>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? <ToggleForm.NullDisplay /> : <Display pool={pool} />}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x1 0)"
                data-h2-margin-bottom="base(x1)"
              >
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
                      maxLength={1023}
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
                      maxLength={1023}
                    />
                  </>
                ) : undefined}
                <div
                  data-h2-display="base(grid)"
                  data-h2-grid-template-columns="base(1fr) l-tablet(1fr 1fr)"
                  data-h2-gap="base(x1)"
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
                    data-h2-width="base(100%)"
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
                    data-h2-width="base(100%)"
                  />
                </div>
              </div>
              <ActionWrapper>
                {!formDisabled && (
                  <Submit
                    text={intl.formatMessage(formMessages.saveChanges)}
                    aria-label={intl.formatMessage({
                      defaultMessage: "Save core requirements",
                      id: "Iu55iw",
                      description: "Text on a button to save core requirements",
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

export default CoreRequirementsSection;
export type { CoreRequirementsSubmitData };
