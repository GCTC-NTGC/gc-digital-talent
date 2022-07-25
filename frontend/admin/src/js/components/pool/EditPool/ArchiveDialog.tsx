import React from "react";
import { useIntl } from "react-intl";
import Dialog from "@common/components/Dialog";
import { Button } from "@common/components";

type ArchiveDialogProps = {
  isOpen: boolean;
  onDismiss: () => void;
  onArchive: () => void;
};

const ArchiveDialog = ({
  isOpen,
  onDismiss,
  onArchive,
}: ArchiveDialogProps): JSX.Element => {
  const intl = useIntl();
  const Footer = React.useMemo(
    () => (
      <div data-h2-display="b(flex)">
        <div style={{ flexGrow: 2 } /* push other div to the right */}>
          <Button onClick={onDismiss} mode="outline" color="secondary">
            {intl.formatMessage({
              defaultMessage: "Cancel and go back",
              description: "Close dialog button",
            })}
          </Button>
        </div>
        <div>
          <Button
            onClick={() => {
              onArchive();
              onDismiss();
            }}
            mode="solid"
            color="secondary"
          >
            {intl.formatMessage({
              defaultMessage: "Archive pool",
              description:
                "Button to archive the pool in the archive pool dialog",
            })}
          </Button>
        </div>
      </div>
    ),
    [intl, onDismiss, onArchive],
  );
  return (
    <Dialog
      centered
      isOpen={isOpen}
      onDismiss={onDismiss}
      color="ts-secondary"
      title={intl.formatMessage({
        defaultMessage: "Archive",
        description: "Heading for the archive pool dialog",
      })}
      footer={Footer}
    >
      {/* todo */}
    </Dialog>
  );
};

export default ArchiveDialog;
