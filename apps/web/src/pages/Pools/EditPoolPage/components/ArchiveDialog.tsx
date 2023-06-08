import React from "react";
import { useIntl } from "react-intl";

import { Dialog, Button } from "@gc-digital-talent/ui";

type ArchiveDialogProps = {
  onArchive: () => void;
};

const ArchiveDialog = ({ onArchive }: ArchiveDialogProps): JSX.Element => {
  const intl = useIntl();
  const Footer = React.useMemo(
    () => (
      <>
        <div style={{ flexGrow: 2 } /* push other div to the right */}>
          <Dialog.Close>
            <Button color="secondary">
              {intl.formatMessage({
                defaultMessage: "Cancel and go back",
                id: "tiF/jI",
                description: "Close dialog button",
              })}
            </Button>
          </Dialog.Close>
        </div>
        <div>
          <Dialog.Close>
            <Button
              onClick={() => {
                onArchive();
              }}
              mode="solid"
              color="secondary"
            >
              {intl.formatMessage({
                defaultMessage: "Archive pool",
                id: "Jc0lds",
                description:
                  "Button to archive the pool in the archive pool dialog",
              })}
            </Button>
          </Dialog.Close>
        </div>
      </>
    ),
    [intl, onArchive],
  );
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button color="secondary" mode="solid" disabled>
          {intl.formatMessage({
            defaultMessage: "Archive",
            id: "P8NuMo",
            description: "Text on a button to archive the pool",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Archive",
            id: "Hqt/ej",
            description: "Heading for the archive pool dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          {/* todo */}
          <Dialog.Footer>{Footer}</Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ArchiveDialog;
