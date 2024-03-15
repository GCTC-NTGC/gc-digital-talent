import React from "react";
import { useIntl } from "react-intl";
import { AnimatePresence, m } from "framer-motion";
import { useQuery } from "urql";
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
} from "@gc-digital-talent/ui";

import UnreadAlertBellIcon from "./UnreadAlertBellIcon";

const Overlay = m(DialogPrimitive.Overlay);

// Note: Get only the first 9999 unread items (we should hopefully not care past this)
const NotificationCount_Query = graphql(/* GraphQL */ `
  query NotificationCount {
    notifications(where: { onlyUnread: true }, first: 1) {
      data {
        id
      }
    }
  }
`);

const ellipsis = () => (
  <EllipsisVerticalIcon
    data-h2-width="base(x.75)"
    data-h2-vertical-align="base(middle)"
  />
);

const NotificationDialog = () => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const [{ data }] = useQuery({ query: NotificationCount_Query });
  const notificationCount = unpackMaybes(data?.notifications?.data).length;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button
          mode="icon_only"
          color="black"
          icon={notificationCount > 0 ? UnreadAlertBellIcon : BellAlertIconSm}
          data-h2-position="base(relative)"
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
              data-h2-position="base(fixed)"
              data-h2-location="base(0)"
              data-h2-z-index="base(9998)"
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
                data-h2-max-width="base(95vw)"
                data-h2-width="base(x18)"
                data-h2-position="base(fixed)"
                data-h2-top="base(0)"
                data-h2-right="base(0)"
                data-h2-bottom="base(0)"
                data-h2-margin="base(x.5 x.5 x.5 auto)"
                data-h2-radius="base(s)"
                data-h2-shadow="base(0 0.55rem 1rem -0.2rem rgba(0, 0, 0, .5))"
                data-h2-z-index="base(9999)"
              >
                <div data-h2-padding="base(x1)">
                  <div
                    data-h2-display="base(flex)"
                    data-h2-align-items="base(center)"
                    data-h2-justify-content="base(space-between)"
                    data-h2-gap="base(x.25 0)"
                    data-h2-margin-bottom="base(x.5)"
                  >
                    <Heading
                      level="h2"
                      size="h5"
                      color="primary"
                      Icon={BellAlertIcon}
                      data-h2-margin="base(0)"
                      data-h2-line-height="base(1)"
                    >
                      {intl.formatMessage({
                        defaultMessage: "Notifications",
                        id: "OQ1hHo",
                        description: "Title for notifications",
                      })}
                    </Heading>
                    <div
                      data-h2-display="base(flex)"
                      data-h2-gap="base(x.25 0)"
                    >
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
              </m.div>
            </DialogPrimitive.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};

export default NotificationDialog;
