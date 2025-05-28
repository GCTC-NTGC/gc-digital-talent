import { useState } from "react";
import { useIntl } from "react-intl";
import ArchiveBoxIcon from "@heroicons/react/24/solid/ArchiveBoxIcon";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";

import { ProcessDialogProps } from "./types";

type UnarchiveProcessDialogProps = ProcessDialogProps & {
  onUnarchive: () => Promise<void>;
};

const UnarchiveProcessDialog = ({
  poolName,
  isFetching,
  onUnarchive,
}: UnarchiveProcessDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const intl = useIntl();

  const title = intl.formatMessage({
    defaultMessage: "Un-archive process",
    id: "c060kv",
    description: "Title to un-archive a process",
  });

  const handleUnarchive = async () => {
    await onUnarchive().then(() => {
      setIsOpen(false);
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="warning" mode="inline">
          {title}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{title}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin-bottom="base(x1)">
            {intl.formatMessage(
              {
                id: "TrbPjE",
                defaultMessage:
                  "You are about to un-archive this process: {poolName}",
                description: "Text to confirm the process to be un-archived",
              },
              {
                poolName,
              },
            )}
          </p>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "This will show this pool back to the public. All users associated with this pool will be able to see it in their profile information.",
              id: "YZRjdG",
              description: "Second paragraph for un-archive pool dialog",
            })}
          </p>
          <Dialog.Footer>
            <Button
              color="error"
              onClick={handleUnarchive}
              icon={ArchiveBoxIcon}
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

export default UnarchiveProcessDialog;
