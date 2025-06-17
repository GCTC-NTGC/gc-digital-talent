import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { AnimatePresence, m, usePresence } from "motion/react";
import BellAlertIcon from "@heroicons/react/24/outline/BellAlertIcon";
import BellAlertIconSm from "@heroicons/react/20/solid/BellAlertIcon";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import { UseQueryExecute } from "urql";

import { unpackMaybes, useIsSmallScreen } from "@gc-digital-talent/helpers";
import { graphql } from "@gc-digital-talent/graphql";
import {
  DialogPrimitive,
  Button,
  Heading,
  Dialog,
  Link,
  IconButton,
  ButtonProps,
} from "@gc-digital-talent/ui";

import usePollingQuery from "~/hooks/usePollingQuery";
import useRoutes from "~/hooks/useRoutes";
import notificationMessages from "~/messages/notificationMessages";

import UnreadAlertBellIcon from "./UnreadAlertBellIcon";
import NotificationList from "../NotificationList/NotificationList";

const Overlay = m.create(DialogPrimitive.Overlay);

// For the sake of the bell icon, we only care if the user has at least 1 unread notification
// This is to query to minimal amount of data to display the badge
const NotificationCount_Query = graphql(/* GraphQL */ `
  query NotificationCount {
    notifications(where: { onlyUnread: true }, first: 1) {
      data {
        id
      }
    }
  }
`);

const DialogPortalWithPresence = ({
  executeQuery,
}: {
  executeQuery: UseQueryExecute;
}) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [isPresent] = usePresence();
  const [render, setRender] = useState<boolean>(isPresent);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    if (isPresent) {
      setRender(true);
    } else {
      // let animation complete before removal
      timerId = setTimeout(() => {
        setRender(false);
      }, 200);
    }
    return () => clearTimeout(timerId);
  }, [isPresent]);

  const handleCloseFocus = () => {
    if (containerRef?.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  return render ? (
    <Dialog.Portal forceMount>
      <Overlay
        forceMount
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 0.85 }}
        exit={{ opacity: 0.85 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[97] bg-gray-700/90"
      />
      <DialogPrimitive.Content forceMount asChild>
        <m.div
          ref={containerRef}
          initial={{ x: "100%", scale: 0.95 }}
          animate={{ x: 0, scale: 1 }}
          exit={{ x: "100%", scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed inset-y-0 right-0 z-[98] m-3 ml-auto w-110 max-w-[95vw] overflow-y-auto rounded bg-white font-sans text-black shadow-lg dark:bg-gray-600 dark:text-white"
        >
          <div className="p-6">
            <div className="mb-3 flex items-center justify-between gap-y-1.5">
              <DialogPrimitive.Title asChild>
                <Heading
                  level="h2"
                  size="h5"
                  color="secondary"
                  icon={BellAlertIcon}
                  className="mt-0 leading-normal"
                >
                  {intl.formatMessage(notificationMessages.title)}
                </Heading>
              </DialogPrimitive.Title>
              <div className="flex gap-x-1.5">
                <Dialog.Close asChild>
                  <IconButton
                    color="black"
                    icon={XMarkIcon}
                    onFocus={handleCloseFocus}
                    label={intl.formatMessage({
                      defaultMessage: "Close notifications",
                      id: "J1n6QO",
                      description:
                        "Button text to close the notifications dialog",
                    })}
                  />
                </Dialog.Close>
              </div>
            </div>
            <DialogPrimitive.Description>
              {intl.formatMessage({
                defaultMessage:
                  "Welcome to your notification panel. Click or activate a notification to be taken to the relevant page. Each notification can be marked as read or deleted.",
                id: "qek0N+",
                description: "Instructions on how to manage notifications",
              })}
            </DialogPrimitive.Description>
          </div>
          <NotificationList live inDialog limit={30} onRead={executeQuery} />
          <p className="m-6">
            <DialogPrimitive.Close asChild>
              <Link href={paths.notifications()} mode="solid" color="primary">
                {intl.formatMessage({
                  defaultMessage: "View all notifications",
                  id: "/lVSP/",
                  description: "Link text for the notifications page",
                })}
              </Link>
            </DialogPrimitive.Close>
          </p>
        </m.div>
      </DialogPrimitive.Content>
    </Dialog.Portal>
  ) : null;
};

interface NotificationDialog {
  /** Controllable open state */
  open?: boolean;
  /** Callback when the section has been 'opened */
  onOpenChange?: (open: boolean) => void;
  /** Trigger color */
  color?: ButtonProps["color"];
}
const NotificationDialog = ({
  open,
  onOpenChange,
  color,
}: NotificationDialog) => {
  const intl = useIntl();
  const isSmallScreen = useIsSmallScreen(1080);

  useEffect(() => {
    if (open) {
      // Pushing the change to the end of the call stack
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 0);

      return () => clearTimeout(timer);
    } else {
      document.body.style.pointerEvents = "auto";
      return undefined;
    }
  }, [open]);

  const [{ data }, executeQuery] = usePollingQuery(
    { query: NotificationCount_Query },
    60,
  );
  const notificationCount = unpackMaybes(data?.notifications?.data).length;
  const buttonLabel = open
    ? intl.formatMessage({
        defaultMessage: "Close notifications",
        id: "J1n6QO",
        description: "Button text to close the notifications dialog",
      })
    : intl.formatMessage(
        {
          defaultMessage: "View notifications{count}",
          id: "l82MWI",
          description: "Button text to open the notifications dialog",
        },
        {
          count:
            notificationCount > 0
              ? ` ${intl.formatMessage({
                  defaultMessage: "(there are unread notifications)",
                  id: "o+YSXN",
                  description: "Notice of unread notifications",
                })}`
              : "",
        },
      );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {open ? (
        <Dialog.Close asChild>
          {isSmallScreen ? (
            <Button
              mode="solid"
              color={color ?? "black"}
              icon={XMarkIcon}
              aria-label={buttonLabel}
            />
          ) : (
            <IconButton
              color={color ?? "white"}
              icon={XMarkIcon}
              label={buttonLabel}
            />
          )}
        </Dialog.Close>
      ) : (
        <DialogPrimitive.Trigger asChild>
          {isSmallScreen ? (
            <Button
              mode="solid"
              color="black"
              icon={
                notificationCount > 0 ? UnreadAlertBellIcon : BellAlertIconSm
              }
              aria-label={buttonLabel}
            />
          ) : (
            <IconButton
              color={isSmallScreen ? "black" : "secondary"}
              icon={
                notificationCount > 0 ? UnreadAlertBellIcon : BellAlertIconSm
              }
              label={buttonLabel}
              className="text-white hover:text-primary-200 data-active:text-secondary-200 dark:data-active:text-primary-100"
            />
          )}
        </DialogPrimitive.Trigger>
      )}

      <AnimatePresence initial={false}>
        {open && <DialogPortalWithPresence executeQuery={executeQuery} />}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default NotificationDialog;
