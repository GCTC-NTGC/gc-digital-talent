import { useState } from "react";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import { useIntl } from "react-intl";

import { AlertDialog, Button, IconButton, Notice } from "@gc-digital-talent/ui";
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
    <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog.Trigger>
        <IconButton color="error" icon={TrashIcon} />
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>{title}</AlertDialog.Title>
        <AlertDialog.Description>
          <p className="mb-6">
            {intl.formatMessage({
              id: "P8DJDV",
              defaultMessage: "You are about to delete this assessment:",
              description: "Text to confirm the assessment to be deleted",
            })}
          </p>
          <Notice.Root className="mb-6">
            <Notice.Content>
              <p>{assessmentTitle}</p>
            </Notice.Content>
          </Notice.Root>
          <p className="font-bold">
            {intl.formatMessage({
              id: "Yb8Ylg",
              defaultMessage: "This cannot be undone.",
              description:
                "Final warning text to confirm the assessment to be deleted",
            })}
          </p>
          <AlertDialog.Footer>
            <AlertDialog.Action>
              <Button color="error" onClick={handleRemove} icon={TrashIcon}>
                {title}
              </Button>
            </AlertDialog.Action>
            <AlertDialog.Cancel>
              <Button color="warning" mode="inline">
                {intl.formatMessage(formMessages.cancelGoBack)}
              </Button>
            </AlertDialog.Cancel>
          </AlertDialog.Footer>
        </AlertDialog.Description>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default ConfirmationDialog;
