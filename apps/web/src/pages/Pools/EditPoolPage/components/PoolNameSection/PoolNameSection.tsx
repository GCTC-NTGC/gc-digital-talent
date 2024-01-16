import * as React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import TagIcon from "@heroicons/react/24/outline/TagIcon";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getPublishingGroup,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { Input, Select, Submit, enumToOptions } from "@gc-digital-talent/forms";

import {
  PublishingGroup,
  PoolStatus,
  Classification,
  Maybe,
} from "~/api/generated";
import {
  hasAllEmptyFields,
  hasEmptyRequiredFields,
} from "~/validators/process/classification";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import processMessages from "~/messages/processMessages";

import { useEditPoolContext } from "../EditPoolContext";
import Display from "./Display";
import {
  FormValues,
  PoolNameSubmitData,
  dataToFormValues,
  formValuesToSubmitData,
  getClassificationOptions,
  getStreamOptions,
} from "./utils";
import { SectionProps } from "../../types";
import ActionWrapper from "../ActionWrapper";

type PoolNameSectionProps = SectionProps<PoolNameSubmitData> & {
  classifications: Array<Maybe<Classification>>;
};

const PoolNameSection = ({
  pool,
  classifications,
  sectionMetadata,
  onSave,
}: PoolNameSectionProps): JSX.Element => {
  const intl = useIntl();
  const isNull = hasAllEmptyFields(pool);
  const emptyRequired = hasEmptyRequiredFields(pool);
  const { isSubmitting } = useEditPoolContext();
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull,
    emptyRequired,
    fallbackIcon: TagIcon,
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(pool),
  });
  const { handleSubmit } = methods;

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
      "This section covers the process’ basics, including classification, job title, and closing date.",
    id: "5nUjqK",
    description: "Describes selecting a advertisement details for a process.",
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
        size="h4"
        toggle={
          <ToggleForm.LabelledTrigger
            disabled={formDisabled}
            sectionTitle={sectionMetadata.title}
          />
        }
        data-h2-font-weight="base(bold)"
      >
        {sectionMetadata.title}
      </ToggleSection.Header>
      <p>{subtitle}</p>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <ToggleForm.NullDisplay
              title={sectionMetadata.id}
              content={subtitle}
            />
          ) : (
            <Display pool={pool} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div
                data-h2-display="base(grid)"
                data-h2-gap="base(x1)"
                data-h2-grid-template-columns="l-tablet(repeat(2, 1fr))"
                data-h2-margin-bottom="base(x1)"
              >
                <Select
                  id="classification"
                  label={intl.formatMessage({
                    defaultMessage: "Classification",
                    id: "w/qZsH",
                    description:
                      "Label displayed on the pool form classification field.",
                  })}
                  name="classification"
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOption,
                  )}
                  options={getClassificationOptions(classifications, intl)}
                  disabled={formDisabled}
                />
                <Select
                  id="stream"
                  label={intl.formatMessage({
                    defaultMessage: "Work stream",
                    id: "UKw7sB",
                    description:
                      "Label displayed on the pool form stream/job title field.",
                  })}
                  name="stream"
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOption,
                  )}
                  options={getStreamOptions(intl)}
                  disabled={formDisabled}
                />
                <Input
                  id="specificTitleEn"
                  name="specificTitleEn"
                  type="text"
                  label={intl.formatMessage({
                    defaultMessage: "Job Title (EN)",
                    id: "oD18m7",
                    description:
                      "Label for a pool advertisements specific English title",
                  })}
                  disabled={formDisabled}
                />
                <Input
                  id="specificTitleFr"
                  name="specificTitleFr"
                  type="text"
                  label={intl.formatMessage({
                    defaultMessage: "Job Title (FR)",
                    id: "oSEimN",
                    description:
                      "Label for a pool advertisements specific French title",
                  })}
                  disabled={formDisabled}
                />
              </div>
              <div
                data-h2-display="base(grid)"
                data-h2-gap="base(x1)"
                data-h2-margin-bottom="base(x1)"
              >
                <Input
                  id="processNumber"
                  name="processNumber"
                  type="text"
                  label={intl.formatMessage({
                    defaultMessage: "Process Number",
                    id: "1E0RiD",
                    description: "Label for a pools process number",
                  })}
                  context={intl.formatMessage({
                    defaultMessage:
                      "This process number is obtained from your HR shop",
                    id: "Ao/+Ba",
                    description:
                      "Additional context describing the pools process number.",
                  })}
                  disabled={formDisabled}
                />
                <Select
                  id="publishingGroup"
                  label={intl.formatMessage(processMessages.publishingGroup)}
                  name="publishingGroup"
                  nullSelection={intl.formatMessage({
                    defaultMessage: "Select a publishing group",
                    id: "Y0WLp5",
                    description: "Placeholder for publishing group field",
                  })}
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
              </div>

              <ActionWrapper>
                {!formDisabled && (
                  <Submit
                    text={intl.formatMessage({
                      defaultMessage: "Save pool name",
                      id: "bbIDc9",
                      description: "Text on a button to save the pool name",
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

export default PoolNameSection;
export type { PoolNameSubmitData };
