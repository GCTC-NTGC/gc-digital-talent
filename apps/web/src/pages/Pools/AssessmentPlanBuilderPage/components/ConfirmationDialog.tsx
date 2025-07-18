import { useState } from "react";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import { useIntl } from "react-intl";

import { Button, Dialog, Well } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";
import { Maybe } from "@gc-digital-talent/graphql";

interface ConfirmationDialogProps {
  assessmentTitle?: Maybe<string>;
  onRemove: () => Promise<void>;
}

const ConfirmationDialog = ({
  assessmentTitle,
  onRemove,
}: ConfirmationDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const intl = useIntl();

  const title = intl.formatMessage({
    defaultMessage: "Delete assessment",
    id: "+WT43U",
    description: "Title to delete an assessment",
  });

  const handleRemove = async () => {
    await onRemove().then(() => {
      setIsOpen(false);
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="error" mode="inline" icon={TrashIcon} />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{title}</Dialog.Header>
        <Dialog.Body>
          <p className="mb-6">
            {intl.formatMessage({
              id: "P8DJDV",
              defaultMessage: "You are about to delete this assessment:",
              description: "Text to confirm the assessment to be deleted",
            })}
          </p>
          <Well className="mb-6">
            <p>{assessmentTitle}</p>
          </Well>
          <p className="font-bold">
            {intl.formatMessage({
              id: "Yb8Ylg",
              defaultMessage: "This cannot be undone.",
              description:
                "Final warning text to confirm the assessment to be deleted",
            })}
          </p>
          <Dialog.Footer>
            <Button color="error" onClick={handleRemove} icon={TrashIcon}>
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

export default ConfirmationDialog;
