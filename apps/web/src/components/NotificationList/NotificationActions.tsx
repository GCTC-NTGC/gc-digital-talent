import { useIntl } from "react-intl";
import { useMutation } from "urql";
import { tv } from "tailwind-variants";

import { Button, Link, useAnnouncer } from "@gc-digital-talent/ui";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";

import { MarkAllNotificationsAsRead_Mutation } from "./mutations";

const notificationActions = tv({
  slots: {
    base: "mb-6 flex gap-6",
    all: "",
    read: "",
  },
  variants: {
    inDialog: {
      true: {
        base: "px-6",
      },
    },
    onlyRead: {
      true: {
        read: "font-bold",
      },
      false: {
        all: "font-bold",
      },
    },
  },
});

interface NotificationActionsProps {
  onlyUnread?: boolean;
  inDialog?: boolean;
  onRead?: () => void;
}

const NotificationActions = ({
  onlyUnread,
  inDialog,
  onRead,
}: NotificationActionsProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { announce } = useAnnouncer();
  const { base, all, read } = notificationActions({ inDialog });

  const [{ fetching: markingAllAsRead }, executeMarkAllAsReadMutation] =
    useMutation(MarkAllNotificationsAsRead_Mutation);

  const handleMarkAllNotificationsAsRead = () => {
    executeMarkAllAsReadMutation({})
      .then(() => {
        announce(
          intl.formatMessage({
            defaultMessage: "Notifications marked as read successfully.",
            id: "7tAIPo",
            description:
              "Message announced to assistive technology when notifications marked as read",
          }),
        );
        onRead?.();
      })
      .catch(() => {
        announce(
          intl.formatMessage(errorMessages.error) +
            intl.formatMessage(commonMessages.dividingColon) +
            intl.formatMessage({
              defaultMessage: "could not mark notifications as read.",
              id: "rmsF/w",
              description:
                "Message announced to assistive technology when error occurred making notifications as read",
            }),
        );
      });
  };

  return (
    <div className={base()}>
      {!inDialog && (
        <>
          <Link
            color="black"
            className={all()}
            href={paths.notifications()}
            {...(!onlyUnread && {
              "aria-current": "page",
            })}
            aria-label={intl.formatMessage({
              defaultMessage: "All notifications",
              id: "pFowOu",
              description: "Link text to show all notifications",
            })}
          >
            {intl.formatMessage({
              defaultMessage: "All",
              id: "Pn0zAn",
              description: "Link text for all items in a list",
            })}
          </Link>
          <Link
            color="black"
            className={read()}
            href={`${paths.notifications()}?unread`}
            {...(onlyUnread && {
              "aria-current": "page",
            })}
            aria-label={intl.formatMessage({
              defaultMessage: "Unread notifications",
              id: "cL3OoZ",
              description: "Link text to show unread notifications",
            })}
          >
            {intl.formatMessage({
              defaultMessage: "Unread",
              id: "uD105N",
              description: "Link text to show all unread items in a list",
            })}
          </Link>
        </>
      )}
      <Button
        mode="inline"
        color="primary"
        className="ml-auto"
        disabled={markingAllAsRead}
        onClick={handleMarkAllNotificationsAsRead}
      >
        {intl.formatMessage({
          defaultMessage: "Mark all as read",
          id: "1FwczA",
          description: "Button text to mark all notifications as read",
        })}
      </Button>
    </div>
  );
};

export default NotificationActions;
