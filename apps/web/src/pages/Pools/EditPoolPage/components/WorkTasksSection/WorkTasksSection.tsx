import * as React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import QueueListIcon from "@heroicons/react/24/outline/QueueListIcon";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import { RichTextInput, Submit } from "@gc-digital-talent/forms";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

import {
  PoolStatus,
  LocalizedString,
  Pool,
  UpdatePoolInput,
} from "~/api/generated";
import {
  hasEmptyRequiredFields,
  hasAllEmptyFields,
} from "~/validators/process/keyTasks";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

import { useEditPoolContext } from "../EditPoolContext";
import { SectionProps } from "../../types";
import Display from "./Display";
import ActionWrapper from "../ActionWrapper";

type FormValues = {
  YourWorkEn?: LocalizedString["en"];
  YourWorkFr?: LocalizedString["fr"];
};

export type WorkTasksSubmitData = Pick<UpdatePoolInput, "keyTasks">;

type WorkTasksSectionProps = SectionProps<WorkTasksSubmitData>;

const TEXT_AREA_MAX_WORDS_EN = 400;
const TEXT_AREA_MAX_WORDS_FR = TEXT_AREA_MAX_WORDS_EN + 100;

const WorkTasksSection = ({
  pool,
  sectionMetadata,
  onSave,
}: WorkTasksSectionProps): JSX.Element => {
  const intl = useIntl();
  const isNull = hasAllEmptyFields(pool);
  const emptyRequired = hasEmptyRequiredFields(pool);
  const { isSubmitting } = useEditPoolContext();
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull,
    emptyRequired,
    fallbackIcon: QueueListIcon,
  });

  const dataToFormValues = (initialData: Pool): FormValues => ({
    YourWorkEn: initialData.keyTasks?.en ?? "",
    YourWorkFr: initialData.keyTasks?.fr ?? "",
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(pool),
  });
  const { handleSubmit } = methods;
  const handleSave = async (formValues: FormValues) => {
    return onSave({
      keyTasks: {
        en: formValues.YourWorkEn,
        fr: formValues.YourWorkFr,
      },
    })
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
      "This information lets applicants know the type of work they will be expected to perform. Talk about the tasks and expectations related to this work.",
    id: "rI/GPp",
    description:
      "Describes the 'work tasks' section of a process' advertisement.",
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
          {isNull ? <ToggleForm.NullDisplay /> : <Display pool={pool} />}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div
                data-h2-display="base(grid)"
                data-h2-gap="base(x1)"
                data-h2-grid-template-columns="l-tablet(repeat(2, 1fr))"
                data-h2-margin="base(x1 0)"
              >
                <RichTextInput
                  id="YourWorkEn"
                  label={intl.formatMessage({
                    defaultMessage: "English - Your work",
                    id: "lb7SoP",
                    description:
                      "Label for the English - Your Work textarea in the edit pool page.",
                  })}
                  name="YourWorkEn"
                  {...(!formDisabled && { wordLimit: TEXT_AREA_MAX_WORDS_EN })}
                  readOnly={formDisabled}
                />
                <RichTextInput
                  id="YourWorkFr"
                  label={intl.formatMessage({
                    defaultMessage: "French - Your work",
                    id: "8bJgxK",
                    description:
                      "Label for the French - Your Work textarea in the edit pool page.",
                  })}
                  name="YourWorkFr"
                  {...(!formDisabled && { wordLimit: TEXT_AREA_MAX_WORDS_FR })}
                  readOnly={formDisabled}
                />
              </div>

              <ActionWrapper>
                {!formDisabled && (
                  <Submit
                    text={intl.formatMessage(formMessages.saveChanges)}
                    aria-label={intl.formatMessage({
                      defaultMessage: "Save work tasks",
                      id: "tiv5J7",
                      description:
                        "Text on a button to save the pool work tasks",
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

export default WorkTasksSection;
