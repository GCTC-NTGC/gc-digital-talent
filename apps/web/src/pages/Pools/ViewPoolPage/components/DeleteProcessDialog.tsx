import { useState } from "react";
import { useIntl } from "react-intl";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";

import { ProcessDialogProps } from "./types";

type DeleteProcessDialogProps = ProcessDialogProps & {
  onDelete: () => Promise<void>;
};

const DeleteProcessDialog = ({
  poolName,
  isFetching,
  onDelete,
}: DeleteProcessDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const intl = useIntl();

  const title = intl.formatMessage({
    defaultMessage: "Delete process",
    id: "nZj1Gb",
    description: "Title to delete a process",
  });

  const handleDelete = async () => {
    await onDelete().then(() => {
      setIsOpen(false);
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="error" mode="inline">
          {title}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{title}</Dialog.Header>
        <Dialog.Body>
          <p className="mb-6">
            {intl.formatMessage(
              {
                id: "bozF1y",
                defaultMessage:
                  "You are about to delete this process: {poolName}",
                description: "Text to confirm the process to be deleted",
              },
              {
                poolName,
              },
            )}
          </p>
          <p className="my-6">
            {intl.formatMessage({
              id: "Mtiz1l",
              defaultMessage:
                "This will delete this process from searches and dashboards everywhere. <strong>This cannot be undone</strong>.",
              description:
                "Text explaining what will happen when deleting a process",
            })}
          </p>
          <Dialog.Footer>
            <Button
              color="error"
              onClick={handleDelete}
              icon={TrashIcon}
              disabled={isFetching}
            >
              {title}
            </Button>
            <Dialog.Close>
              <Button color="warning" mode="inline">
                {intl.formatMessage(formMessages.cancelGoBack)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DeleteProcessDialog;
