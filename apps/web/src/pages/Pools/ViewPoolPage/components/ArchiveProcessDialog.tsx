import { useState } from "react";
import { useIntl } from "react-intl";
import ArchiveBoxIcon from "@heroicons/react/24/solid/ArchiveBoxIcon";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";

import { ProcessDialogProps } from "./types";

type ArchiveProcessDialogProps = ProcessDialogProps & {
  onArchive: () => Promise<void>;
};

const ArchiveProcessDialog = ({
  poolName,
  isFetching,
  onArchive,
}: ArchiveProcessDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const intl = useIntl();

  const title = intl.formatMessage({
    defaultMessage: "Archive process",
    id: "mVeDxD",
    description: "Title to archive a process",
  });

  const handleArchive = async () => {
    await onArchive().then(() => {
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
          <p className="mb-6">
            {intl.formatMessage(
              {
                id: "JESKii",
                defaultMessage:
                  "You are about to archive this process: {poolName}",
                description: "Text to confirm the process to be archived",
              },
              {
                poolName,
              },
            )}
          </p>
          <p className="my-6">
            {intl.formatMessage({
              id: "iA1Q8d",
              defaultMessage:
                "This will remove this process from automatically appearing in request searches and dashboards everywhere.",
              description:
                "Text explaining what will happen when archiving a process",
            })}
          </p>
          <Dialog.Footer>
            <Button
              color="error"
              onClick={handleArchive}
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

export default ArchiveProcessDialog;
