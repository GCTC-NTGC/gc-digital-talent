import React from "react";
import { useIntl } from "react-intl";

import { Button, Link } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

import NotificationItem from "./NotificationItem";

interface NotificationListProps {
  children: React.ReactNode;
  onlyUnread?: boolean;
}

const NotificationList = ({ children, onlyUnread }: NotificationListProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  return (
    <>
      <div data-h2-display="base(flex)" data-h2-gap="base(x1)">
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
        <Button
          mode="inline"
          color="secondary"
          data-h2-margin-left="base(auto)"
          onClick={() => console.log("Mark all as read mutation")}
        >
          {intl.formatMessage({
            defaultMessage: "Mark all as read",
            id: "1FwczA",
            description: "Button text to mark all notifications as read",
          })}
        </Button>
      </div>
      <ul
        data-h2-list-style="base(none)"
        data-h2-padding="base(0)"
        data-h2-margin="base(x1 0)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x.25 0)"
      >
        {children}
      </ul>
    </>
  );
};

export default {
  Root: NotificationList,
  Item: NotificationItem,
};
