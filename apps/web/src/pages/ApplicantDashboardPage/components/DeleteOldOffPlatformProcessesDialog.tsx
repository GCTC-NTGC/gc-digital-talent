import { useState } from "react";
import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { commonMessages } from "@gc-digital-talent/i18n";
import { graphql } from "@gc-digital-talent/graphql";

const DeleteOldOffPlatformRecruitmentProcesses_Mutation = graphql(
  /* GraphQL */ `
    mutation deleteOldOffPlatformRecruitmentProcess(
      $id: ID!
      $user: UpdateUserAsUserInput!
    ) {
      updateUserAsUser(id: $id, user: $user) {
        id
      }
    }
  `,
);

interface DeleteOldOffPlatformProcessDialogProps {
  userId: string;
}

const DeleteOldOffPlatformProcessesDialog = ({
  userId,
}: DeleteOldOffPlatformProcessDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  const [{ fetching }, executeMutation] = useMutation(
    DeleteOldOffPlatformRecruitmentProcesses_Mutation,
  );

  const requestMutation = async (id: string) => {
    const result = await executeMutation({
      id,
      user: { oldOffPlatformRecruitmentProcesses: null },
    });
    if (result.data?.updateUserAsUser?.id) {
      return result.data.updateUserAsUser.id;
    }
    return Promise.reject(new Error(result.error?.toString()));
  };

  const handleDelete = async () => {
    await requestMutation(userId)
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

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button
          type="button"
          mode="inline"
          className="font-normal text-gray-600 dark:text-gray-100"
        >
          <span className="text-sm">
            {intl.formatMessage({
              defaultMessage:
                "You can also choose to delete this information now.",
              id: "MCLe8z",
              description:
                "Button text for opening dialog to delete old off-platform process data.",
            })}
          </span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content simpleHeader>
        <Dialog.Header simple>
          {intl.formatMessage({
            defaultMessage: "Delete information saved in the old format",
            id: "hO8vGS",
            description: "Dialog header informing of purpose",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p className="mb-4.5">
            {intl.formatMessage({
              defaultMessage:
                "Before deleting this information, make sure you've added your off-platform recruitment processes using the new “Add an off-platform process” button on your dashboard.",
              id: "1yrLje",
              description:
                "Explanation of delete old off platform processes dialog part 1",
            })}
          </p>
          <p className="mb-4.5">
            {intl.formatMessage({
              defaultMessage:
                "Are you sure you want to delete the off-platform process information stored in the old format?",
              id: "rOMDmX",
              description:
                "Explanation of delete old off platform processes dialog part 2",
            })}
          </p>
          <Dialog.Footer>
            <Button
              disabled={fetching}
              type="button"
              color="error"
              onClick={handleDelete}
            >
              {fetching
                ? intl.formatMessage(commonMessages.removing)
                : intl.formatMessage(commonMessages.delete)}
            </Button>
            <Dialog.Close>
              <Button type="button" color="warning" mode="inline">
                {intl.formatMessage(commonMessages.cancel)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DeleteOldOffPlatformProcessesDialog;
