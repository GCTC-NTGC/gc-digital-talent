import React from "react";
import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

type DeleteDialogProps = {
  onDelete: () => void;
  trigger: React.ReactNode;
};

const DeleteDialog = ({
  onDelete,
  trigger,
}: DeleteDialogProps): JSX.Element => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
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
              {intl.formatMessage(commonMessages.delete)}
            </Button>
          </Dialog.Close>
        </div>
      </>
    ),
    [intl, onDelete],
  );
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage(commonMessages.delete)}
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
