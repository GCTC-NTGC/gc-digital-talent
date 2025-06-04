import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { Button, Link, useAnnouncer } from "@gc-digital-talent/ui";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";

import { MarkAllNotificationsAsRead_Mutation } from "./mutations";

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
    <div
      data-h2-display="base(flex)"
      data-h2-gap="base(x1)"
      data-h2-margin-bottom="base(x1)"
      {...(inDialog && {
        "data-h2-padding": "base(0 x1)",
      })}
    >
      {!inDialog && (
        <>
          <Link
            color="black"
            href={paths.notifications()}
            {...(!onlyUnread && {
              "aria-current": "page",
              "data-h2-font-weight": "base(700)",
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
            href={`${paths.notifications()}?unread`}
            {...(onlyUnread && {
              "aria-current": "page",
              "data-h2-font-weight": "base(700)",
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
        data-h2-margin-left="base(auto)"
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
