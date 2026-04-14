import ExclamationTriangleIcon from "@heroicons/react/24/solid/ExclamationTriangleIcon";
import { useIntl } from "react-intl";

import { Dialog } from "@gc-digital-talent/ui";

interface InactivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  remainingMinutes: number;
}

const InactivityDialog = ({
  open,
  onOpenChange,
  remainingMinutes,
}: InactivityDialogProps) => {
  const intl = useIntl();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <div className="flex flex-row gap-3">
            <ExclamationTriangleIcon className="w-6 text-warning" />
            <span>
              {intl.formatMessage({
                defaultMessage:
                  "Your session is about to end due to inactivity",
                id: "eMMDjW",
                description: "Title for the inactivity dialog",
              })}
            </span>
          </div>
        </Dialog.Header>
        <Dialog.Body>
          {intl.formatMessage({
            defaultMessage:
              "If you do not continue your session you will be signed out automatically and unsaved changes will be lost.",
            id: "PRaqZT",
            description: "Body for the inactivity dialog",
          })}
          {intl.formatMessage(
            {
              defaultMessage: `Time remaining: <strong>{remainingMinutes, plural,
                  zero {0 minutes}
                  one {# minute}
                  other {# minutes}
                }</strong>`,
              id: "H69949",
              description: "Inactivity timer remaining time",
            },
            {
              remainingMinutes,
            },
          )}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};
export default InactivityDialog;
