import React from "react";
import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";

type DeleteDialogProps = {
  onDelete: () => void;
};

const DeleteDialog = ({ onDelete }: DeleteDialogProps): JSX.Element => {
  const intl = useIntl();
  const Footer = React.useMemo(
    () => (
      <>
        <div style={{ flexGrow: 2 } /* push other div to the right */}>
          <Dialog.Close>
            <Button mode="outline" color="secondary">
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
                onDelete();
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
          </Dialog.Close>
        </div>
      </>
    ),
    [intl, onDelete],
  );
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button color="secondary" mode="solid">
          {intl.formatMessage({
            defaultMessage: "Delete",
            id: "IFGKCz",
            description: "Text on a button to delete the pool",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Delete",
            id: "iOgr3Z",
            description: "Heading for the delete pool dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
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
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DeleteDialog;
