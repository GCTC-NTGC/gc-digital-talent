import { useState } from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { Dialog, Button, Ul } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { TextArea } from "@gc-digital-talent/forms";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { graphql, UpdateUserAsUserInput } from "@gc-digital-talent/graphql";

const UpdateUser_OffPlatformProcessesMutation = graphql(/* GraphQL */ `
  mutation UpdateUserOffPlatformProcessesMutation(
    $id: ID!
    $user: UpdateUserAsUserInput!
  ) {
    updateUserAsUser(id: $id, user: $user) {
      id
    }
  }
`);

interface FormValues {
  oldOffPlatformRecruitmentProcesses: string | null | undefined;
}

interface OffPlatformProcessesDialogProps {
  userId: string;
  oldOffPlatformRecruitmentProcesses: string | null | undefined;
}

const OffPlatformProcessesDialog = ({
  userId,
  oldOffPlatformRecruitmentProcesses,
}: OffPlatformProcessesDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const methods = useForm<FormValues>({
    defaultValues: {
      oldOffPlatformRecruitmentProcesses: oldOffPlatformRecruitmentProcesses,
    },
  });

  const [{ fetching }, executeMutation] = useMutation(
    UpdateUser_OffPlatformProcessesMutation,
  );

  const requestMutation = async (id: string, values: UpdateUserAsUserInput) => {
    const result = await executeMutation({ id, user: values });
    if (result.data?.updateUserAsUser?.id) {
      return result.data.updateUserAsUser.id;
    }
    return Promise.reject(new Error(result.error?.toString()));
  };

  const submitForm: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    await requestMutation(userId, {
      oldOffPlatformRecruitmentProcesses:
        formValues.oldOffPlatformRecruitmentProcesses ?? null,
    })
      .then(() => {
        toast.success(
          intl.formatMessage(commonMessages.accountUpdateSuccessful),
        );
        setOpen(false);
      })
      .catch(() => {
        toast.error(intl.formatMessage(commonMessages.accountUpdateFailed));
      });
  };
  const { handleSubmit } = methods;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button color="secondary" mode="inline">
          {intl.formatMessage({
            defaultMessage: "Edit off-platform process information",
            id: "g17mQL",
            description: "Button to open dialog to edit information",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Tell us about recruitment processes you're qualified in on other Government of Canada platforms.",
            id: "knm4b3",
            description: "Dialog subtitle informing of purpose",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Edit off-platform process information",
            id: "jrt4zY",
            description: "Dialog header informing of purpose",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p className="mb-4.5">
            {intl.formatMessage({
              defaultMessage:
                "The information you provide here will be verified. You can add all the processes and pools you're qualified in. When possible, provide the following information:",
              id: "AJXRC6",
              description: "Explanation of dialog",
            })}
          </p>
          <Ul space="md">
            <li>
              {intl.formatMessage({
                defaultMessage: "The process or pool number",
                id: "ooBbNZ",
                description: "Info list item",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage: "The occupational group (e.g., IT, AS, etc.)",
                id: "T3geYt",
                description: "Info list item",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage: "The level (e.g., 01, 02, 03, etc.)",
                id: "JThAS2",
                description: "Info list item",
              })}
            </li>
          </Ul>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitForm)}>
              <div className="mt-4.5 mb-0.75">
                <TextArea
                  id="oldOffPlatformRecruitmentProcesses"
                  name="oldOffPlatformRecruitmentProcesses"
                  wordLimit={200}
                  label={intl.formatMessage({
                    defaultMessage: "Off-platform process information",
                    id: "izBEYf",
                    description: "Form input label",
                  })}
                />
              </div>
              <Dialog.Footer>
                <Button disabled={fetching} type="submit" color="primary">
                  {fetching
                    ? intl.formatMessage(commonMessages.saving)
                    : intl.formatMessage(formMessages.saveChanges)}
                </Button>
                <Dialog.Close>
                  <Button type="button" color="warning" mode="inline">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default OffPlatformProcessesDialog;
