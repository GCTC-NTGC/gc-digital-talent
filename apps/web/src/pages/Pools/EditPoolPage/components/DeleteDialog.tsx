import React from "react";
import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

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
            <Button color="secondary">
              {intl.formatMessage(formMessages.cancelGoBack)}
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
              {intl.formatMessage(commonMessages.delete)}
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
          {intl.formatMessage(commonMessages.delete)}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage(commonMessages.delete)}
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
