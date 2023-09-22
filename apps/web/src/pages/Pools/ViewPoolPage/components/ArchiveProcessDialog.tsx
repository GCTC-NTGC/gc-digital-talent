import React from "react";
import { useIntl } from "react-intl";
import ArchiveBoxIcon from "@heroicons/react/24/solid/ArchiveBoxIcon";

import { Dialog, Button } from "@gc-digital-talent/ui";

type ArchiveProcessDialogProps = {
  poolName: React.ReactNode;
  onArchive: () => void;
};

const ArchiveProcessDialog = ({
  poolName,
  onArchive,
}: ArchiveProcessDialogProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const intl = useIntl();

  const title = intl.formatMessage({
    defaultMessage: "Archive process",
    id: "mVeDxD",
    description: "Title to archive a process",
  });

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
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              id: "iA1Q8d",
              defaultMessage:
                "This will remove this process from automatically appearing in request searches and dashboards everywhere.",
              description:
                "Text explaining what will happen when archiving a process",
            })}
          </p>
          <Dialog.Footer data-h2-justify-content="base(flex-start)">
            <Dialog.Close>
              <Button color="secondary" mode="inline">
                {intl.formatMessage({
                  defaultMessage: "Cancel and go back",
                  id: "tiF/jI",
                  description: "Close dialog button",
                })}
              </Button>
            </Dialog.Close>
            <Button
              mode="solid"
              color="error"
              onClick={onArchive}
              icon={ArchiveBoxIcon}
            >
              {title}
            </Button>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ArchiveProcessDialog;
