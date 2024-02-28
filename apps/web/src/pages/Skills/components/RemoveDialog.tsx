import React from "react";
import { useIntl } from "react-intl";

import { Button, CardRepeater, Dialog } from "@gc-digital-talent/ui";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

type RemoveDialogProps = {
  onRemove: () => Promise<void>;
  index: number;
};

const RemoveDialog = ({ onRemove, index }: RemoveDialogProps): JSX.Element => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isBusy, setIsBusy] = React.useState<boolean>(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Dialog.Trigger>
        <CardRepeater.Remove
          aria-label={intl.formatMessage(formMessages.repeaterRemove, {
            index,
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
              defaultMessage: "You're about to remove this skill.",
              id: "D0wyx7",
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
                onClick={() => {
                  setIsBusy(true);
                  onRemove()
                    .then(() => setIsOpen(false))
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
                }}
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
