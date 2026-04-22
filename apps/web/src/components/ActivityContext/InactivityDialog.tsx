import ExclamationTriangleIcon from "@heroicons/react/24/solid/ExclamationTriangleIcon";
import ClockIcon from "@heroicons/react/24/outline/ClockIcon";
import { useIntl } from "react-intl";

import { Button, Dialog, IconLabel, Image } from "@gc-digital-talent/ui";
import { useTheme } from "@gc-digital-talent/theme";

import authMessages from "~/messages/authMessages";
import pugDarkLg from "~/assets/img/inactive-pug-dark-lg.webp";
import pugLightLg from "~/assets/img/inactive-pug-light-lg.webp";
import pugDarkSm from "~/assets/img/inactive-pug-dark-sm.webp";
import pugLightSm from "~/assets/img/inactive-pug-light-sm.webp";

interface InactivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  remainingMinutes: number;
  onStaySignedIn: () => void;
  onSignOut: () => void;
}

const InactivityDialog = ({
  open,
  onOpenChange,
  remainingMinutes,
  onStaySignedIn,
  onSignOut,
}: InactivityDialogProps) => {
  const intl = useIntl();
  const theme = useTheme();
  const themeMode = theme.mode as "dark" | "light"; // can remove type override when #16536 is fixed

  const imgSrcs = {
    light: pugLightLg,
    dark: pugDarkLg,
  };
  const imgSources = {
    light: {
      xs: pugLightSm,
    },
    dark: {
      xs: pugDarkSm,
    },
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <div className="flex flex-row gap-3 self-start">
            <ExclamationTriangleIcon
              // StyleTitle in packages/ui/src/components/Dialog/Dialog.tsx: 90% of "text-2xl lg:text-3xl"
              className="h-[--spacing(9*0.9)] min-w-9 pt-[--spacing(9*0.1)] text-warning lg:h-[--spacing(10.5*0.9)] lg:min-w-10.5 lg:pt-[--spacing(10.5*0.1)]"
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
          <div className="grid gap-(--text-sm) xs:grid-cols-[1fr_1fr]">
            <p className="order-1 xs:col-span-2">
              {intl.formatMessage({
                defaultMessage:
                  "If you do not continue your session you will be signed out automatically and unsaved changes will be lost.",
                id: "PRaqZT",
                description: "Body for the inactivity dialog",
              })}
            </p>
            <div className="order-2">
              <IconLabel
                label={intl.formatMessage(
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
                icon={ClockIcon}
              />
            </div>
            <p className="order-3 xs:order-4">
              {intl.formatMessage({
                defaultMessage: "Do you wish to continue your session?",
                id: "m163e9",
                description: "Call to action in the inactivity dialog",
              })}
            </p>
            <div className="order-4 mt-6 -mb-12 place-self-center xs:order-3 xs:row-span-2 xs:mt-0">
              <Image
                src={imgSrcs[themeMode]}
                sources={imgSources[themeMode]}
                alt=""
                className="max-h-25"
              />
            </div>
          </div>

          <Dialog.Footer>
            <Button onClick={onStaySignedIn}>
              {intl.formatMessage(authMessages.staySignedIn)}
            </Button>
            <Button mode="inline" onClick={onSignOut}>
              {intl.formatMessage(authMessages.signOut)}
            </Button>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};
export default InactivityDialog;
