import ExclamationTriangleIcon from "@heroicons/react/24/solid/ExclamationTriangleIcon";
import ClockIcon from "@heroicons/react/24/outline/ClockIcon";
import { useIntl } from "react-intl";

import { Button, Dialog, Image } from "@gc-digital-talent/ui";

import authMessages from "~/messages/authMessages";
import pug from "~/assets/img/572675090-cd64c467-98d9-4c7a-bfee-954303d8bf88.png";

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
          <div className="flex flex-row gap-3 self-start">
            <ExclamationTriangleIcon
              className="h-9 text-warning lg:h-12"
              aria-hidden="false"
              aria-label={intl.formatMessage({
                defaultMessage: "Warning",
                id: "Yn2mVD",
                description: "Accessible label for a warning icon",
              })}
            />
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
          <div className="flex flex-col gap-(--text-sm)">
            <span>
              {intl.formatMessage({
                defaultMessage:
                  "If you do not continue your session you will be signed out automatically and unsaved changes will be lost.",
                id: "PRaqZT",
                description: "Body for the inactivity dialog",
              })}
            </span>
            <div className="flex flex-row gap-[--spacing(6*0.3)]">
              <ClockIcon
                className="h-6"
                aria-hidden="false"
                aria-label={intl.formatMessage({
                  defaultMessage: "timer",
                  id: "1Ooizo",
                  description: "Accessible label for a clock icon",
                })}
              />
              <span>
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
              </span>
            </div>
            <span>
              {intl.formatMessage({
                defaultMessage: "Do you wish to continue your session?",
                id: "m163e9",
                description: "Call to action in the inactivity dialog",
              })}
            </span>

            <div className="-mb-12 self-center">
              <Image src={pug} alt="" width="357" height="190" />
            </div>
          </div>

          <Dialog.Footer>
            <Button>{intl.formatMessage(authMessages.staySignedIn)}</Button>
            <Button mode="inline">
              {intl.formatMessage(authMessages.signOut)}
            </Button>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};
export default InactivityDialog;
