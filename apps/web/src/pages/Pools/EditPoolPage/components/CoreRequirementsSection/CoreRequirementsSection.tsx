import { useIntl } from "react-intl";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import InboxStackIcon from "@heroicons/react/24/outline/InboxStackIcon";
import isEmpty from "lodash/isEmpty";
import { useQuery } from "urql";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import {
  Input,
  RadioGroup,
  Select,
  Submit,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import {
  commonMessages,
  formMessages,
  sortPoolLanguage,
  sortSecurityStatus,
} from "@gc-digital-talent/i18n";
import {
  PoolStatus,
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
    status {
      value
      label {
        en
        fr
      }
    }
    language {
      value
      label {
        en
        fr
      }
    }
    securityClearance {
      value
      label {
        en
        fr
      }
    }
    isRemote
    location {
      en
      fr
    }
  }
`);

const CoreRequirementOptions_Query = graphql(/* GraphQL */ `
  query CoreRequirementOptions {
    languages: localizedEnumStrings(enumName: "PoolLanguage") {
      value
      label {
        en
        fr
      }
    }
    securityStatuses: localizedEnumStrings(enumName: "SecurityStatus") {
      value
      label {
        en
        fr
      }
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
}: CoreRequirementsSectionProps) => {
  const intl = useIntl();
  const [{ data }] = useQuery({ query: CoreRequirementOptions_Query });
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
  const { handleSubmit, control, watch } = methods;
  const locationOption = useWatch<FormValues>({
    control,
    name: "locationOption",
  });

  const watchSpecificLocationEn = watch("specificLocationEn");
  const watchSpecificLocationFr = watch("specificLocationFr");

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
  const formDisabled = pool.status?.value !== PoolStatus.Draft;

  const subtitle = intl.formatMessage({
    defaultMessage:
      "This section covers requirements such as remote work, on-site locations, language, and security.",
    id: "+qkjh+",
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
                        defaultMessage: "Specific location (English)",
                        id: "bEY1qp",
                        description:
                          "Label for a pool advertisements specific English Location",
                      })}
                      disabled={formDisabled}
                      maxLength={1023}
                      rules={{
                        validate: () => {
                          if (
                            watchSpecificLocationFr &&
                            isEmpty(watchSpecificLocationEn)
                          ) {
                            return false;
                          }

                          return true;
                        },
                      }}
                    />
                    <Input
                      id="specificLocationFr"
                      name="specificLocationFr"
                      type="text"
                      label={intl.formatMessage({
                        defaultMessage: "Specific location (French)",
                        id: "4tGRa+",
                        description:
                          "Label for a pool advertisements specific French Location",
                      })}
                      disabled={formDisabled}
                      maxLength={1023}
                      rules={{
                        validate: () => {
                          if (
                            watchSpecificLocationEn &&
                            isEmpty(watchSpecificLocationFr)
                          ) {
                            return false;
                          }

                          return true;
                        },
                      }}
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
                    options={localizedEnumToOptions(
                      sortPoolLanguage(data?.languages),
                      intl,
                    )}
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
                    options={localizedEnumToOptions(
                      sortSecurityStatus(data?.securityStatuses),
                      intl,
                    )}
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
