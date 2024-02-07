import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import ChatBubbleBottomCenterIcon from "@heroicons/react/24/outline/ChatBubbleBottomCenterIcon";
import { useMutation } from "urql";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { Submit, TextArea } from "@gc-digital-talent/forms";
import { Maybe, PoolCandidate, graphql } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { errorMessages, formMessages } from "@gc-digital-talent/i18n";

import adminMessages from "~/messages/adminMessages";

type FormValues = {
  notes?: PoolCandidate["notes"];
};

interface NotesDialogProps {
  poolCandidateId: string;
  notes: Maybe<string> | undefined;
}

const PoolCandidate_UpdateNotesMutation = graphql(/* GraphQL */ `
  mutation PoolCandidate_UpdateNotes($id: UUID!, $notes: String!) {
    updatePoolCandidateNotes(id: $id, notes: $notes) {
      id
      notes
    }
  }
`);

const NotesDialog = ({ poolCandidateId, notes }: NotesDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [, executeMutation] = useMutation(PoolCandidate_UpdateNotesMutation);

  const methods = useForm<FormValues>({
    defaultValues: {
      notes: notes ?? "",
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
    await executeMutation({ id: poolCandidateId, notes: values.notes ?? "" })
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
          setIsOpen(false);
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
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button
          icon={ChatBubbleBottomCenterIcon}
          type="button"
          color="primary"
          mode="inline"
        >
          {intl.formatMessage({
            defaultMessage: "View Notes",
            id: "DHQasU",
            description:
              "Button label for view notes on view pool candidate page",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Write additional comments about this application. This is visible only to managers of this process.",
            id: "i4171w",
            description:
              "Subtitle for view notes dialog on view pool candidate page",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Notes and comments",
            id: "5j409K",
            description:
              "Title for view notes dialog on view pool candidate page",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <TextArea
                id="notes"
                name="notes"
                label={intl.formatMessage(adminMessages.notes)}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <Dialog.Footer data-h2-justify-content="base(flex-start)">
                <Dialog.Close>
                  <Button type="button" color="primary" mode="inline">
                    {intl.formatMessage(formMessages.cancelGoBack)}
                  </Button>
                </Dialog.Close>
                <Submit
                  text={intl.formatMessage(formMessages.saveChanges)}
                  color="primary"
                  mode="solid"
                />
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default NotesDialog;
