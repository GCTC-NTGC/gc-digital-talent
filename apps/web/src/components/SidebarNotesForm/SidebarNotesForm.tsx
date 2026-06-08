import ChatBubbleBottomCenterIcon from "@heroicons/react/20/solid/ChatBubbleBottomCenterIcon";
import { useForm, FormProvider } from "react-hook-form";
import { useIntl } from "react-intl";

import { TextArea, Submit } from "@gc-digital-talent/forms";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { ToggleSection, Button } from "@gc-digital-talent/ui";

import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import adminMessages from "~/messages/adminMessages";

import ToggleForm from "../ToggleForm/ToggleForm";

export interface FormValues {
  notes?: string | null;
}

interface SidebarNotesFormProps {
  values?: FormValues;
  onSave: (values: FormValues) => Promise<void>;
}

const SidebarNotesForm = ({ values, onSave }: SidebarNotesFormProps) => {
  const intl = useIntl();

  const { isEditing, setIsEditing } = useToggleSectionInfo({
    isNull: !!values?.notes?.length,
    emptyRequired: false,
    fallbackIcon: ChatBubbleBottomCenterIcon,
  });

  const methods = useForm<FormValues>({
    defaultValues: {
      notes: values?.notes ?? "",
    },
  });

  const handleSubmit = async (formValues: FormValues) => {
    await onSave(formValues)
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Notes updated successfully.",
            id: "0RH74P",
            description: "Success message displayed after updating notes",
          }),
        );

        methods.resetField("notes", {
          keepDirty: false,
          defaultValue: formValues.notes,
        });

        setIsEditing(false);
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: Could not update notes",
            id: "6Fbigo",
            description: "Error message when updating notes fails",
          }),
        );
      });
  };

  return (
    <ToggleSection.Root open={isEditing} onOpenChange={setIsEditing}>
      {/** Note: Empty className simply removes the default styles */}
      <ToggleSection.Content className="">
        <ToggleSection.InitialContent className="flex flex-col gap-y-4.5">
          <ToggleForm.FieldDisplay
            label={intl.formatMessage(adminMessages.notes)}
          >
            {values?.notes ? (
              // NOTE: Scroll elements need tab index
              // REF: https://dequeuniversity.com/rules/axe/4.11/scrollable-region-focusable?application=axeAPI
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              <div className="mt-3 max-h-40 overflow-y-auto" tabIndex={0}>
                {values?.notes}
              </div>
            ) : (
              intl.formatMessage(commonMessages.notProvided)
            )}
          </ToggleForm.FieldDisplay>
          <ToggleForm.Trigger className="text-left">
            {values?.notes
              ? intl.formatMessage({
                  defaultMessage: "Edit notes",
                  id: "CTl5IT",
                  description:
                    "Button text to start editing pool candidate notes",
                })
              : intl.formatMessage({
                  defaultMessage: "Add notes",
                  id: "w0IA+c",
                  description:
                    "Button text to start adding pool candidate notes",
                })}
          </ToggleForm.Trigger>
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleSubmit)}
              className="flex flex-col gap-3"
            >
              <TextArea
                id="notes"
                name="notes"
                label={intl.formatMessage(adminMessages.notes)}
                rows={8}
              />
              <div className="flex flex-wrap gap-3 text-center">
                <Submit text={intl.formatMessage(formMessages.saveChanges)} />
                <ToggleSection.Close>
                  <Button mode="inline" type="button" color="warning">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </ToggleSection.Close>
              </div>
            </form>
          </FormProvider>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default SidebarNotesForm;
