import { useIntl } from "react-intl";
import { useMutation } from "urql";
import type { ReactNode } from "react";

import { AlertDialog, Button } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { DeleteNotification_Mutation } from "./mutations";

interface RemoveDialogProps {
  id: string;
  message: ReactNode;
  date: string;
  isOpen?: boolean;
  onOpenChange?: (newOpen: boolean) => void;
}

const RemoveDialog = ({
  id,
  message,
  date,
  isOpen,
  onOpenChange,
}: RemoveDialogProps) => {
  const intl = useIntl();

  const [{ fetching: deleting }, executeDeleteMutation] = useMutation(
    DeleteNotification_Mutation,
  );

  const handleDelete = async () => {
    await executeDeleteMutation({ id }).then((res) => {
      if (res.data?.deleteNotification) {
        onOpenChange?.(false);
      }
    });
  };

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Content>
        <AlertDialog.Title>
          {intl.formatMessage({
            defaultMessage:
              "Are you sure you want to delete this notification?",
            id: "XdynkW",
            description:
              "Heading for confirmation alert to delete a notification",
          })}
        </AlertDialog.Title>
        <AlertDialog.Description>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-200">
            {date}
          </p>
          <div>{message}</div>
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Action>
            <Button color="error" disabled={deleting} onClick={handleDelete}>
              {intl.formatMessage({
                defaultMessage: "Delete notification",
                id: "YaDJN+",
                description: "Button text to confirm deleting a notification",
              })}
            </Button>
          </AlertDialog.Action>
          <AlertDialog.Cancel>
            <Button mode="inline" color="warning">
              {intl.formatMessage(commonMessages.cancel)}
            </Button>
          </AlertDialog.Cancel>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default RemoveDialog;
