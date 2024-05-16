import { useState } from "react";
import { useIntl } from "react-intl";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";

import { ProcessDialogProps } from "./types";

type DuplicateProcessDialogProps = ProcessDialogProps & {
  onDuplicate: () => Promise<void>;
};

const DuplicateProcessDialog = ({
  poolName,
  isFetching,
  onDuplicate,
}: DuplicateProcessDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const intl = useIntl();

  const title = intl.formatMessage({
    defaultMessage: "Duplicate process",
    id: "NUjAy0",
    description: "Title to duplicate a process",
  });

  const handleDuplicate = async () => {
    await onDuplicate().then(() => {
      setIsOpen(false);
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="secondary" mode="inline">
          {title}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{title}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin-bottom="base(x1)">
            {intl.formatMessage(
              {
                id: "G7ICNn",
                defaultMessage:
                  "You are about to duplicate this process: {poolName}",
                description: "Text to confirm the process to be duplicated",
              },
              {
                poolName,
              },
            )}
          </p>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              id: "NivtzV",
              defaultMessage:
                "This will create a new process and copy all existing information.",
              description:
                "Text explaining what will happen when duplicating a process",
            })}
          </p>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              id: "3Rad8l",
              defaultMessage:
                "Do you wish to continue? This will navigate away from this page.",
              description:
                "Text explaining what will happen after duplicating a pool and confirming the action",
            })}
          </p>

          <Dialog.Footer>
            <Button
              color="secondary"
              onClick={handleDuplicate}
              disabled={isFetching}
            >
              {intl.formatMessage({
                defaultMessage: "Duplicate and view new process",
                id: "RZIivj",
                description: "Button text to duplicate a process",
              })}
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

export default DuplicateProcessDialog;
