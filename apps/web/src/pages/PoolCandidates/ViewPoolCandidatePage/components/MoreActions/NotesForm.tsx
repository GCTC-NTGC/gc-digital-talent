import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import ChatBubbleBottomCenterIcon from "@heroicons/react/24/outline/ChatBubbleBottomCenterIcon";
import { useMutation } from "urql";
import isEmpty from "lodash/isEmpty";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import {
  FragmentType,
  Maybe,
  PoolCandidate,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import TextArea from "@gc-digital-talent/forms/TextArea";
import Submit from "@gc-digital-talent/forms/Submit";

import adminMessages from "~/messages/adminMessages";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

const NotesForm_Fragment = graphql(/* Graphql */ `
  fragment NotesForm on PoolCandidate {
    id
    notes
  }
`);
interface FormValues {
  notes?: PoolCandidate["notes"];
}

interface NotesFormProps {
  poolCandidate: FragmentType<typeof NotesForm_Fragment>;
}

const PoolCandidate_UpdateNotesMutation = graphql(/* GraphQL */ `
  mutation PoolCandidate_UpdateNotes($id: UUID!, $notes: String) {
    updatePoolCandidateNotes(id: $id, notes: $notes) {
      id
      notes
    }
  }
`);

const Display = ({ notes }: { notes?: Maybe<string> }) => {
  const intl = useIntl();
  const hasNotes = !!notes;
  return (
    <>
      <ToggleForm.FieldDisplay
        hasError={false}
        label={intl.formatMessage(adminMessages.notes)}
      >
        {hasNotes && (
          <div
            data-h2-margin-top="base(x.5)"
            data-h2-max-height="base(10rem)"
            data-h2-overflow-y="base(auto)"
          >
            {notes}
          </div>
        )}
      </ToggleForm.FieldDisplay>
      {hasNotes ? (
        <ToggleForm.Trigger data-h2-margin-top="base(x.5)">
          {intl.formatMessage({
            defaultMessage: "Edit notes",
            id: "CTl5IT",
            description: "Button text to start editing pool candidate notes",
          })}
        </ToggleForm.Trigger>
      ) : (
        <ToggleForm.Trigger data-h2-margin-top="base(x.5)">
          {intl.formatMessage({
            defaultMessage: "Add notes",
            id: "w0IA+c",
            description: "Button text to start adding pool candidate notes",
          })}
        </ToggleForm.Trigger>
      )}
    </>
  );
};

const NotesForm = ({ poolCandidate: poolCandidateQuery }: NotesFormProps) => {
  const intl = useIntl();
  const [{ fetching }, executeMutation] = useMutation(
    PoolCandidate_UpdateNotesMutation,
  );
  const poolCandidate = getFragment(NotesForm_Fragment, poolCandidateQuery);

  const { isEditing, setIsEditing } = useToggleSectionInfo({
    isNull: isEmpty(poolCandidate.notes),
    emptyRequired: false,
    fallbackIcon: ChatBubbleBottomCenterIcon,
  });

  const methods = useForm<FormValues>({
    defaultValues: {
      notes: poolCandidate.notes ?? "",
    },
  });
  const { handleSubmit } = methods;

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: could not update pool candidate status",
        id: "FSlrKF",
        description:
          "Message displayed when an error occurs while an admin updates a pool candidate",
      }),
    );
  };

  const handleFormSubmit: SubmitHandler<FormValues> = async (
    values: FormValues,
  ) => {
    await executeMutation({ id: poolCandidate.id, notes: values.notes ?? "" })
      .then((result) => {
        if (result.data?.updatePoolCandidateNotes) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Pool candidate status updated successfully",
              id: "uSdcX4",
              description:
                "Message displayed when a pool candidate has been updated by and admin",
            }),
          );
        } else {
          handleError();
        }
      })
      .catch(() => {
        handleError();
      });

    methods.resetField("notes", {
      keepDirty: false,
      defaultValue: values.notes,
    });

    setIsEditing(false);
  };

  return (
    <ToggleSection.Root
      id="notes-dialog-form"
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          <Display notes={poolCandidate.notes} />
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x.5)"
            >
              <TextArea
                id="notes"
                name="notes"
                label={intl.formatMessage(adminMessages.notes)}
                rows={8}
              />

              <div
                data-h2-display="base(flex)"
                data-h2-flex-wrap="base(wrap)"
                data-h2-text-align="base(center)"
                data-h2-gap="base(x.5)"
              >
                <Submit
                  text={intl.formatMessage(formMessages.saveChanges)}
                  color="primary"
                  mode="solid"
                  isSubmitting={fetching}
                />
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

export default NotesForm;
