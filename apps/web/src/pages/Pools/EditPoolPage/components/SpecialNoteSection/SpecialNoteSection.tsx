import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import NewspaperIcon from "@heroicons/react/24/outline/NewspaperIcon";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import { Checkbox, RichTextInput, Submit } from "@gc-digital-talent/forms";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import {
  LocalizedString,
  Pool,
  UpdatePoolInput,
  graphql,
  FragmentType,
  getFragment,
  PoolStatus,
} from "@gc-digital-talent/graphql";

import { hasAllEmptyFields } from "~/validators/process/specialNote";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import useCanUserEditPool from "~/hooks/useCanUserEditPool";

import { useEditPoolContext } from "../EditPoolContext";
import { PublishedEditableSectionProps, SectionProps } from "../../types";
import Display from "./Display";
import ActionWrapper from "../ActionWrapper";
import UpdatePublishedProcessDialog, {
  type FormValues as UpdateFormValues,
} from "../UpdatePublishedProcessDialog/UpdatePublishedProcessDialog";

const EditPoolSpecialNote_Fragment = graphql(/* GraphQL */ `
  fragment EditPoolSpecialNote on Pool {
    ...UpdatePublishedProcessDialog
    id
    status {
      value
      label {
        en
        fr
      }
    }
    specialNote {
      en
      fr
    }
  }
`);

interface FormValues {
  hasSpecialNote: boolean;
  specialNoteEn?: LocalizedString["en"];
  specialNoteFr?: LocalizedString["fr"];
}

export type SpecialNoteSubmitData = Pick<UpdatePoolInput, "specialNote">;

type SpecialNoteSectionProps = SectionProps<
  SpecialNoteSubmitData,
  FragmentType<typeof EditPoolSpecialNote_Fragment>
> &
  PublishedEditableSectionProps;

const TEXT_AREA_MAX_WORDS_EN = 100;
const TEXT_AREA_MAX_WORDS_FR = TEXT_AREA_MAX_WORDS_EN + 30;

const SpecialNoteSection = ({
  poolQuery,
  sectionMetadata,
  onSave,
  onUpdatePublished,
}: SpecialNoteSectionProps) => {
  const intl = useIntl();
  const pool = getFragment(EditPoolSpecialNote_Fragment, poolQuery);
  const isNull = hasAllEmptyFields(pool);
  const canEdit = useCanUserEditPool(pool.status?.value);
  const { isSubmitting } = useEditPoolContext();
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull,
    emptyRequired: false, // Not a required field
    fallbackIcon: NewspaperIcon,
    optional: true,
  });

  const dataToFormValues = (initialData: Pool): FormValues => ({
    hasSpecialNote:
      !!initialData.specialNote?.en || !!initialData.specialNote?.fr,
    specialNoteEn: initialData.specialNote?.en ?? "",
    specialNoteFr: initialData.specialNote?.fr ?? "",
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(pool),
  });
  const { handleSubmit, watch } = methods;
  const [watchHasSpecialNote, specialNoteEn, specialNoteFr] = watch([
    "hasSpecialNote",
    "specialNoteEn",
    "specialNoteFr",
  ]);

  const onSuccess = (formValues: FormValues) => {
    methods.reset(formValues, { keepDirty: false });
    setIsEditing(false);
  };

  const handleSave = async (formValues: FormValues) => {
    return onSave({
      specialNote: formValues.hasSpecialNote
        ? {
            en: formValues.specialNoteEn ?? "",
            fr: formValues.specialNoteFr ?? "",
          }
        : null, // Save data if confirmation box (hasSpecialNote) is selected
    })
      .then(() => onSuccess(formValues))
      .catch(() => methods.reset(formValues));
  };

  const handleUpdatePublished = async (formValues: UpdateFormValues) => {
    await onUpdatePublished({
      ...formValues,
      specialNote: watchHasSpecialNote
        ? {
            en: specialNoteEn,
            fr: specialNoteFr,
          }
        : null,
    }).then(() => {
      onSuccess({
        hasSpecialNote: watchHasSpecialNote,
        specialNoteEn,
        specialNoteFr,
      });
    });
  };

  const subtitle = intl.formatMessage({
    defaultMessage:
      "Most job advertisements will not require a special note. This section is for special circumstances only. Examples of this special note include identifying if a process may be used to hire in multiple classifications or if the process is limited to application from a specific equity group.",
    id: "C43ZgD",
    description:
      "Describes the 'special note' section of a process' advertisement.",
  });

  return (
    <ToggleSection.Root
      id={`${sectionMetadata.id}-form`}
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Header
        icon={icon.icon}
        color={icon.color}
        level="h2"
        size="h3"
        toggle={
          <ToggleForm.LabelledTrigger
            disabled={!canEdit}
            sectionTitle={sectionMetadata.title}
          />
        }
      >
        {sectionMetadata.title}
      </ToggleSection.Header>
      <p>{subtitle}</p>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <ToggleForm.NullDisplay optional />
          ) : (
            <Display pool={pool} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div data-h2-margin-bottom="base(x1)">
                <Checkbox
                  id="has-special-note"
                  name="hasSpecialNote"
                  boundingBox
                  boundingBoxLabel={intl.formatMessage({
                    defaultMessage: "Confirmation of need for special note",
                    id: "JBavNE",
                    description:
                      "Label for input confirmation of need for special note on edit pool.",
                  })}
                  label={intl.formatMessage({
                    defaultMessage:
                      "“I need a special note. I have reviewed my job advertisement preview and I confirm that this information is not covered anywhere else on the job advertisement.”",
                    id: "XgmS+Y",
                    description:
                      "Checkbox selection that confirms need for a special note on edit page.",
                  })}
                  disabled={!canEdit}
                />
              </div>
              {watchHasSpecialNote && (
                <div
                  data-h2-display="base(grid)"
                  data-h2-gap="base(x1)"
                  data-h2-grid-template-columns="l-tablet(repeat(2, 1fr))"
                  data-h2-margin="base(x1, 0)"
                >
                  <RichTextInput
                    id="whatToExpectEn"
                    label={intl.formatMessage({
                      defaultMessage: "English - Special note for this process",
                      id: "+JMvBQ",
                      description:
                        "Label for the English - Special note for this process textarea on edit pool page.",
                    })}
                    name="specialNoteEn"
                    wordLimit={TEXT_AREA_MAX_WORDS_EN}
                    readOnly={!canEdit}
                  />
                  <RichTextInput
                    id="whatToExpectFr"
                    label={intl.formatMessage({
                      defaultMessage: "French - Special note for this process",
                      id: "YcMhCm",
                      description:
                        "Label for the French - Special note for this process textarea in the edit pool page.",
                    })}
                    name="specialNoteFr"
                    wordLimit={TEXT_AREA_MAX_WORDS_FR}
                    readOnly={!canEdit}
                  />
                </div>
              )}

              <ActionWrapper>
                {canEdit && pool.status?.value === PoolStatus.Draft && (
                  <Submit
                    text={intl.formatMessage(formMessages.saveChanges)}
                    aria-label={intl.formatMessage({
                      defaultMessage: "Save special note",
                      id: "SH3WsZ",
                      description:
                        "Text on a button to save the pool special note",
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
                  <Button mode="inline" type="button" color="warning">
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

export default SpecialNoteSection;
