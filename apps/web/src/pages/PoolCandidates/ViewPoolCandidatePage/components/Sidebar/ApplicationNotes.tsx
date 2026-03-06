import { useIntl } from "react-intl";
import { useMutation } from "urql";
import ChatBubbleBottomCenterIcon from "@heroicons/react/24/outline/ChatBubbleBottomCenterIcon";
import { FormProvider, useForm } from "react-hook-form";

import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { Button, ToggleSection } from "@gc-digital-talent/ui";
import { Submit, TextArea } from "@gc-digital-talent/forms";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import adminMessages from "~/messages/adminMessages";

const ApplicationNotes_Fragment = graphql(/** GraphQL */ `
  fragment ApplicationNotes on PoolCandidate {
    id
    notes
  }
`);

const UpdateApplicationNotes_Mutation = graphql(/** GraphQL */ `
  mutation UpdateApplicationNotes($id: UUID!, $notes: String) {
    updatePoolCandidateNotes(id: $id, notes: $notes) {
      id
      notes
    }
  }
`);

interface FormValues {
  notes?: Scalars["String"]["input"];
}

interface ApplicationNotesProps {
  query: FragmentType<typeof ApplicationNotes_Fragment>;
}

const ApplicationNotes = ({ query }: ApplicationNotesProps) => {
  const intl = useIntl();
  const application = getFragment(ApplicationNotes_Fragment, query);
  const [, updateNotes] = useMutation(UpdateApplicationNotes_Mutation);

  const { isEditing, setIsEditing } = useToggleSectionInfo({
    isNull: !!application.notes?.length,
    emptyRequired: false,
    fallbackIcon: ChatBubbleBottomCenterIcon,
  });

  const methods = useForm<FormValues>({
    defaultValues: {
      notes: application.notes ?? "",
    },
  });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: Could not update notes",
        id: "6Fbigo",
        description: "Error message when updating notes fails",
      }),
    );
  };

  const handleSubmit = async (formValues: FormValues) => {
    await updateNotes({ id: application.id, notes: formValues.notes })
      .then((res) => {
        if (!res.data || res.error) {
          handleError();
          return;
        }

        toast.success(
          intl.formatMessage({
            defaultMessage: "Notes updated successfully!",
            id: "t9FeTB",
            description: "Success message displayed after updating notes",
          }),
        );

        methods.resetField("notes", {
          keepDirty: false,
          defaultValue: formValues.notes,
        });

        setIsEditing(false);
      })
      .catch(handleError);
  };

  return (
    <ToggleSection.Root open={isEditing} onOpenChange={setIsEditing}>
      {/** Note: Empty className simply removes the default styles */}
      <ToggleSection.Content className="">
        <ToggleSection.InitialContent className="flex flex-col gap-y-4.5">
          <ToggleForm.FieldDisplay
            label={intl.formatMessage(adminMessages.notes)}
          >
            {application.notes ? (
              <div className="mt-3 max-h-40 overflow-y-auto">
                {application.notes}
              </div>
            ) : (
              intl.formatMessage(commonMessages.notProvided)
            )}
          </ToggleForm.FieldDisplay>
          <ToggleForm.Trigger className="text-left">
            {application.notes
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

export default ApplicationNotes;
