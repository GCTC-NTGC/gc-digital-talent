import React from "react";
import { useIntl } from "react-intl";
import { AnimatePresence, m } from "framer-motion";
import BellAlertIcon from "@heroicons/react/24/outline/BellAlertIcon";
import BellAlertIconSm from "@heroicons/react/20/solid/BellAlertIcon";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import EllipsisVerticalIcon from "@heroicons/react/20/solid/EllipsisVerticalIcon";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import { graphql } from "@gc-digital-talent/graphql";
import {
  DialogPrimitive,
  Button,
  Heading,
  Dialog,
  Link,
} from "@gc-digital-talent/ui";

import usePollingQuery from "~/hooks/usePollingQuery";
import useRoutes from "~/hooks/useRoutes";
import notificationMessages from "~/messages/notificationMessages";

import UnreadAlertBellIcon from "./UnreadAlertBellIcon";
import NotificationList from "../NotificationList/NotificationList";

const Overlay = m(DialogPrimitive.Overlay);

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

const ellipsis = () => <EllipsisVerticalIcon className="w-4.5 align-middle" />;

const NotificationDialog = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const [{ data }, executeQuery] = usePollingQuery(
    { query: NotificationCount_Query },
    60,
  );
  const notificationCount = unpackMaybes(data?.notifications?.data).length;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button
          mode="icon_only"
          color="black"
          className="relative"
          icon={notificationCount > 0 ? UnreadAlertBellIcon : BellAlertIconSm}
          aria-label={intl.formatMessage({
            defaultMessage: "View notifications",
            id: "ztx8xL",
            description: "Button text to open the notifications dialog",
          })}
        />
      </DialogPrimitive.Trigger>
      <AnimatePresence initial={false}>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Overlay
              forceMount
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              data-h2-background-color="base:all(black)"
              className="fixed inset-0 z-[80]"
            />
            <DialogPrimitive.Content forceMount asChild>
              <m.div
                initial={{ x: "100%", scale: 0.95 }}
                animate={{ x: 0, scale: 1 }}
                exit={{ x: "100%", scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                data-h2-background-color="base(foreground)"
                data-h2-color="base(black)"
                data-h2-font-family="base(sans)"
                className="fixed inset-0 left-auto z-[90] my-3 mr-3 w-[27rem] max-w-[95vw] overflow-y-auto rounded shadow-lg"
              >
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between gap-y-1.5">
                    <Heading
                      level="h2"
                      size="h5"
                      color="primary"
                      Icon={BellAlertIcon}
                      data-h2-margin="base(0)"
                      data-h2-line-height="base(1)"
                    >
                      {intl.formatMessage(notificationMessages.title)}
                    </Heading>
                    <div className="flex gap-y-1.5">
                      <Dialog.Close asChild>
                        <Button
                          mode="icon_only"
                          color="black"
                          icon={XMarkIcon}
                          aria-label={intl.formatMessage({
                            defaultMessage: "Close notifications",
                            id: "J1n6QO",
                            description:
                              "Button text to close the notifications dialog",
                          })}
                        />
                      </Dialog.Close>
                    </div>
                  </div>
                  <p>
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "Welcome to your notification panel. Click or tap a notification to be taken to the relevant page. Use the <icon></icon> icon to mark a specific notification as read, pin it, or delete it.",
                        id: "koUnRG",
                        description:
                          "Instructions on how to manage notifications",
                      },
                      {
                        icon: () => ellipsis(),
                      },
                    )}
                  </p>
                </div>
                <NotificationList
                  live
                  inDialog
                  limit={30}
                  onRead={executeQuery}
                />
                <p className="mx-6 my-3">
                  <DialogPrimitive.Close asChild>
                    <Link
                      href={paths.notifications()}
                      mode="solid"
                      color="secondary"
                    >
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
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};

export default NotificationDialog;
