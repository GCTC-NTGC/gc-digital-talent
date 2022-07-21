import React from "react";
import { useIntl } from "react-intl";
import Dialog from "@common/components/Dialog";
import { Button } from "@common/components";

type DeleteDialogProps = {
  isOpen: boolean;
  onDismiss: () => void;
  onDelete: () => void;
};

const DeleteDialog = ({
  isOpen,
  onDismiss,
  onDelete,
}: DeleteDialogProps): JSX.Element => {
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
              onDelete();
              onDismiss();
            }}
            mode="solid"
            color="secondary"
          >
            {intl.formatMessage({
              defaultMessage: "Delete",
              description:
                "Button to delete the pool in the delete pool dialog",
            })}
          </Button>
        </div>
      </div>
    ),
    [intl, onDismiss, onDelete],
  );
  return (
    <Dialog
      centered
      isOpen={isOpen}
      onDismiss={onDismiss}
      color="ts-secondary"
      title={intl.formatMessage({
        defaultMessage: "Delete",
        description: "Heading for the delete pool dialog",
      })}
      footer={Footer}
    >
      <p>
        {intl.formatMessage({
          defaultMessage: "You're about to delete this pool.",
          description: "First paragraph for delete pool dialog",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage: "Are you sure you want to continue?",
          description: "Second paragraph for Delete pool dialog",
        })}
      </p>
    </Dialog>
  );
};

export default DeleteDialog;
