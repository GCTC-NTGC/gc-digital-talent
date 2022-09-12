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
      <div data-h2-display="base(flex)">
        <div style={{ flexGrow: 2 } /* push other div to the right */}>
          <Button onClick={onDismiss} mode="outline" color="secondary">
            {intl.formatMessage({
              defaultMessage: "Cancel and go back",
              id: "tiF/jI",
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
              id: "FA+cJX",
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
        id: "iOgr3Z",
        description: "Heading for the delete pool dialog",
      })}
    >
      <p>
        {intl.formatMessage({
          defaultMessage: "You're about to delete this pool.",
          id: "grrIC7",
          description: "First paragraph for delete pool dialog",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage: "Are you sure you want to continue?",
          id: "/QUq6L",
          description: "Second paragraph for Delete pool dialog",
        })}
      </p>
      <Dialog.Footer>{Footer}</Dialog.Footer>
    </Dialog>
  );
};

export default DeleteDialog;
