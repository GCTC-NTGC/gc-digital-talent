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
  Color,
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
        data-h2-background-color="base:all(black.light)"
        data-h2-position="base(fixed)"
        data-h2-location="base(0)"
        data-h2-z-index="base(97)"
      />
      <DialogPrimitive.Content forceMount asChild>
        <m.div
          ref={containerRef}
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
          data-h2-z-index="base(98)"
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
                    onFocus={handleCloseFocus}
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
              {intl.formatMessage({
                defaultMessage:
                  "Welcome to your notification panel. Click or activate a notification to be taken to the relevant page. Each notification can be marked as read or deleted.",
                id: "qek0N+",
                description: "Instructions on how to manage notifications",
              })}
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

const linkColorStyling = {
  "data-h2-color": `
  base:all(white)
  base:hover(secondary.lighter)
  base:hover:dark(secondary.lighter)
  base:all:focus-visible(black)

  base:children(white)
  base:focus-visible:children(focus)

  base:selectors[[data-active]](secondary.lighter)
  base:dark:selectors[[data-active]](secondary.lightest)
  base:dark:hover:selectors[[data-icon="true"]](secondary.darkest)
`,
};

interface NotificationDialog {
  /** Controllable open state */
  open?: boolean;
  /** Callback when the section has been 'opened */
  onOpenChange?: (open: boolean) => void;
  /** Trigger color */
  color?: Color;
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

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {open ? (
        <Dialog.Close asChild>
          <Button
            mode={isSmallScreen ? "solid" : "icon_only"}
            color={color || isSmallScreen ? "blackFixed" : "whiteFixed"}
            icon={XMarkIcon}
            aria-label={intl.formatMessage({
              defaultMessage: "Close notifications",
              id: "J1n6QO",
              description: "Button text to close the notifications dialog",
            })}
            data-h2-margin-right="base:selectors[>*:first-child](-x.25) l-tablet:selectors[>*:first-child](0)"
          />
        </Dialog.Close>
      ) : (
        <DialogPrimitive.Trigger asChild>
          <Button
            mode={isSmallScreen ? "solid" : "icon_only"}
            color={isSmallScreen ? "black" : "secondary"}
            icon={notificationCount > 0 ? UnreadAlertBellIcon : BellAlertIconSm}
            aria-label={intl.formatMessage(
              {
                defaultMessage: "View notifications{count}",
                id: "l82MWI",
                description: "Button text to open the notifications dialog",
              },
              {
                count:
                  notificationCount > 0
                    ? ` ${intl.formatMessage(
                        {
                          defaultMessage: `({notificationCount, plural,
                            =0 {0 unread}
                            one {{notificationCount, number} unread}
                            other {{notificationCount, number} unread}})`,
                          id: "OpemzD",
                          description: "Number of unread notifications",
                        },
                        { notificationCount },
                      )}`
                    : "",
              },
            )}
            data-h2-margin-right="base:selectors[>*:first-child](-x.25) l-tablet:selectors[>*:first-child](0)"
            data-icon="true"
            {...(!isSmallScreen && linkColorStyling)}
          />
        </DialogPrimitive.Trigger>
      )}

      <AnimatePresence initial={false}>
        {open && <DialogPortalWithPresence executeQuery={executeQuery} />}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default NotificationDialog;
