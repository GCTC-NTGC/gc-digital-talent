import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { AnimatePresence, m, usePresence } from "framer-motion";
import BellAlertIcon from "@heroicons/react/24/outline/BellAlertIcon";
import BellAlertIconSm from "@heroicons/react/20/solid/BellAlertIcon";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import { UseQueryExecute } from "urql";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import { graphql } from "@gc-digital-talent/graphql";
import {
  DialogPrimitive,
  Button,
  Heading,
  Dialog,
  Link,
  commonStyles as sideMenuStyles,
  SideMenuItemChildren,
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

const DialogPortalWithPresence = ({
  executeQuery,
}: {
  executeQuery: UseQueryExecute;
}) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [isPresent] = usePresence();
  const [render, setRender] = useState<boolean>(isPresent);

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

  return render ? (
    <Dialog.Portal forceMount>
      <Overlay
        forceMount
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 0.3 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        data-h2-background-color="base:all(black)"
        data-h2-position="base(fixed)"
        data-h2-location="base(0)"
        data-h2-z-index="base(8)"
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
          data-h2-overflow-y="base(auto)"
          data-h2-position="base(fixed)"
          data-h2-top="base(0)"
          data-h2-right="base(0)"
          data-h2-bottom="base(0)"
          data-h2-margin="base(x.5 x.5 x.5 auto)"
          data-h2-radius="base(s)"
          data-h2-shadow="base(0 0.55rem 1rem -0.2rem rgba(0, 0, 0, .5))"
          data-h2-z-index="base(9)"
        >
          <div data-h2-padding="base(x1)">
            <div
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
              data-h2-justify-content="base(space-between)"
              data-h2-gap="base(x.25 0)"
              data-h2-margin-bottom="base(x.5)"
            >
              <DialogPrimitive.Title asChild>
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
              </DialogPrimitive.Title>
              <div data-h2-display="base(flex)" data-h2-gap="base(x.25 0)">
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
            <DialogPrimitive.Description>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Welcome to your notification panel. Click or activate a notification to be taken to the relevant page. Each notification can be marked as read or deleted.",
                  id: "qek0N+",
                  description: "Instructions on how to manage notifications",
                })}
              </p>
            </DialogPrimitive.Description>
          </div>
          <NotificationList live inDialog limit={30} onRead={executeQuery} />
          <p data-h2-margin="base(x1)">
            <DialogPrimitive.Close asChild>
              <Link href={paths.notifications()} mode="solid" color="secondary">
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

const NotificationDialog = ({ sideMenu }: { sideMenu?: boolean }) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [{ data }, executeQuery] = usePollingQuery(
    { query: NotificationCount_Query },
    60,
  );
  const notificationCount = unpackMaybes(data?.notifications?.data).length;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DialogPrimitive.Trigger asChild>
        {sideMenu ? (
          <Button
            mode="text"
            data-h2-position="base(relative)"
            data-h2-margin-top="base(-x1)"
            {...sideMenuStyles}
          >
            <SideMenuItemChildren
              icon={
                notificationCount > 0 ? UnreadAlertBellIcon : BellAlertIconSm
              }
            >
              {intl.formatMessage(notificationMessages.title)}
            </SideMenuItemChildren>
          </Button>
        ) : (
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
        )}
      </DialogPrimitive.Trigger>
      <AnimatePresence initial={false}>
        {isOpen && <DialogPortalWithPresence executeQuery={executeQuery} />}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};

export default NotificationDialog;
