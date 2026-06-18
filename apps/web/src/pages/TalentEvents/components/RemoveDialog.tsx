import { useIntl } from "react-intl";
import type { Dispatch, SetStateAction } from "react";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Button, Dialog } from "@gc-digital-talent/ui";

interface RemoveDialogProps {
  communityDevelopmentProgramId: string;
  title?: string | null;
  onRemove: () => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<string | null>>;
}

const RemoveDialog = ({
  communityDevelopmentProgramId,
  title,
  onRemove,
  open,
  setOpen,
}: RemoveDialogProps) => {
  const intl = useIntl();

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          setOpen(communityDevelopmentProgramId);
        } else {
          setOpen(null);
        }
      }}
    >
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Remove this development opportunity?",
            id: "Wqw2ZB",
            description: "Heading for the remove development program dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p className="mb-6">
            {intl.formatMessage(
              {
                defaultMessage:
                  "Are you sure you'd like to remove {title} from this event? You can re-add it later if you change your mind, but any nomination specific context you've added will be lost.",
                id: "O/UCCj",
                description:
                  "Final warning message before deleting development program",
              },
              { title: title ?? intl.formatMessage(commonMessages.notFound) },
            )}
          </p>
          <Dialog.Footer>
            <Button type="button" color="error" onClick={onRemove}>
              {intl.formatMessage(commonMessages.remove)}
            </Button>
            <Dialog.Close>
              <Button type="button" color="warning" mode="inline">
                {intl.formatMessage(commonMessages.cancel)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RemoveDialog;
