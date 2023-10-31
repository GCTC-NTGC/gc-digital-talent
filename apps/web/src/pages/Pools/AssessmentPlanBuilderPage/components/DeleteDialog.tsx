import React from "react";
import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";

type DeleteDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onDelete: () => void;
};

const DeleteDialog = ({
  isOpen,
  setIsOpen,
  onDelete,
}: DeleteDialogProps): JSX.Element => {
  const intl = useIntl();
  const Footer = React.useMemo(
    () => (
      <>
        <div>
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
              color="error"
            >
              {intl.formatMessage({
                defaultMessage: "Delete",
                id: "sBksyQ",
                description: "Delete confirmation",
              })}
            </Button>
          </Dialog.Close>
        </div>
      </>
    ),
    [intl, onDelete],
  );
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Delete",
            id: "sBksyQ",
            description: "Delete confirmation",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage({
              defaultMessage: "You're about to delete this assessment.",
              id: "1yO4e+",
              description: "First paragraph for delete assessment step dialog",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage: "Are you sure you want to continue?",
              id: "VhqbdZ",
              description: "Question to continue in a confirmation dialog",
            })}
          </p>
          <Dialog.Footer>{Footer}</Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DeleteDialog;
