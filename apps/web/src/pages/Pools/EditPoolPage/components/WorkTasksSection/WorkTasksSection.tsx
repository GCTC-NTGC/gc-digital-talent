import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import QueueListIcon from "@heroicons/react/24/outline/QueueListIcon";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import {
  PoolStatus,
  LocalizedString,
  Pool,
  UpdatePoolInput,
  graphql,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import RichTextInput from "@gc-digital-talent/forms/RichTextInput";
import Submit from "@gc-digital-talent/forms/Submit";

import {
  hasEmptyRequiredFields,
  hasAllEmptyFields,
} from "~/validators/process/keyTasks";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import useUserCanEditPool from "~/hooks/useCanUserEditPool";

import { useEditPoolContext } from "../EditPoolContext";
import { PublishedEditableSectionProps, SectionProps } from "../../types";
import Display from "./Display";
import ActionWrapper from "../ActionWrapper";
import UpdatePublishedProcessDialog, {
  type FormValues as UpdateFormValues,
} from "../UpdatePublishedProcessDialog/UpdatePublishedProcessDialog";

const EditPoolKeyTasks_Fragment = graphql(/* GraphQL */ `
  fragment EditPoolKeyTasks on Pool {
    ...UpdatePublishedProcessDialog
    id
    status {
      value
      label {
        en
        fr
      }
    }
    keyTasks {
      en
      fr
    }
  }
`);

interface FormValues {
  YourWorkEn?: LocalizedString["en"];
  YourWorkFr?: LocalizedString["fr"];
}

export type WorkTasksSubmitData = Pick<UpdatePoolInput, "keyTasks">;

type WorkTasksSectionProps = SectionProps<
  WorkTasksSubmitData,
  FragmentType<typeof EditPoolKeyTasks_Fragment>
> &
  PublishedEditableSectionProps;

const TEXT_AREA_MAX_WORDS_EN = 400;
const TEXT_AREA_MAX_WORDS_FR = TEXT_AREA_MAX_WORDS_EN + 100;

const WorkTasksSection = ({
  poolQuery,
  sectionMetadata,
  onSave,
  onUpdatePublished,
}: WorkTasksSectionProps) => {
  const intl = useIntl();
  const pool = getFragment(EditPoolKeyTasks_Fragment, poolQuery);
  const isNull = hasAllEmptyFields(pool);
  const emptyRequired = hasEmptyRequiredFields(pool);
  const canEdit = useUserCanEditPool(pool.status?.value);
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
  const { handleSubmit, watch } = methods;
  const values = watch();

  const onSuccess = (formValues: FormValues) => {
    methods.reset(formValues, { keepDirty: true });
    setIsEditing(false);
  };

  const handleSave = async (formValues: FormValues) => {
    return onSave({
      keyTasks: {
        en: formValues.YourWorkEn,
        fr: formValues.YourWorkFr,
      },
    })
      .then(() => onSuccess(formValues))
      .catch(() => methods.reset(formValues));
  };

  const handleUpdatePublished = async (formValues: UpdateFormValues) => {
    await onUpdatePublished({
      ...formValues,
      keyTasks: {
        en: values.YourWorkEn,
        fr: values.YourWorkFr,
      },
    }).then(() => onSuccess({ ...values }));
  };

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
            disabled={!canEdit}
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
                data-h2-margin-bottom="base(x1)"
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
                  wordLimit={TEXT_AREA_MAX_WORDS_EN}
                  readOnly={!canEdit}
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
                  wordLimit={TEXT_AREA_MAX_WORDS_FR}
                  readOnly={!canEdit}
                />
              </div>

              <ActionWrapper>
                {canEdit && pool.status?.value === PoolStatus.Draft && (
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
                {canEdit && pool.status?.value === PoolStatus.Published && (
                  <UpdatePublishedProcessDialog
                    poolQuery={pool}
                    onUpdatePublished={handleUpdatePublished}
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
