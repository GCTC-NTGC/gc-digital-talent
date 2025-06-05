import { useIntl } from "react-intl";
import { useState } from "react";

import { Button, CardRepeater, Dialog } from "@gc-digital-talent/ui";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

interface RemoveDialogProps {
  onRemove: () => Promise<void>;
  index: number;
}

const RemoveDialog = ({ onRemove, index }: RemoveDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isBusy, setIsBusy] = useState<boolean>(false);

  const handleRemove = () => {
    setIsBusy(true);
    onRemove()
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Successfully updated skill",
            id: "vMBiMV",
            description: "Message displayed when a user updates a skill",
          }),
        );
        setIsOpen(false);
      })
      .catch(() =>
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating skill failed",
            id: "kfjmTt",
            description:
              "Message displayed to user after skill fails to be updated",
          }),
        ),
      )
      .finally(() => setIsBusy(false));
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Dialog.Trigger>
        <CardRepeater.Remove
          aria-label={intl.formatMessage(formMessages.repeaterRemove, {
            index: index + 1,
          })}
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage(commonMessages.remove)}
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "You're about to remove this skill from your showcase.",
              id: "cqJw3g",
              description: "First paragraph for remove skill dialog",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage: "Are you sure you want to continue?",
              id: "VhqbdZ",
              description: "Question to continue in a confirmation dialog",
            })}
          </p>
          <Dialog.Footer>
            <div>
              <Dialog.Close>
                <Button color="secondary">
                  {intl.formatMessage(formMessages.cancelGoBack)}
                </Button>
              </Dialog.Close>
            </div>
            <div>
              <Button
                onClick={handleRemove}
                mode="solid"
                color="error"
                disabled={isBusy}
              >
                {intl.formatMessage(commonMessages.remove)}
              </Button>
            </div>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RemoveDialog;
