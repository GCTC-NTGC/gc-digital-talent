import React from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "urql";
import { useIntl } from "react-intl";

import { graphql } from "@gc-digital-talent/graphql";
import { Pending, Well } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import NotificationActions from "./NotificationActions";
import NotificationItem from "./NotificationItem";

const Notifications_Query = graphql(/* GraphQL */ `
  query Notifications(
    $where: NotificationFilterInput
    $first: Int
    $page: Int
  ) {
    notifications(where: $where, first: $first, page: $page) {
      data {
        id
        ...NotificationItem
      }
    }
  }
`);

const NotificationList = () => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const onlyUnread =
    searchParams.has("unread") && searchParams.get("unread") !== null;
  const [{ data, fetching, error }] = useQuery({
    query: Notifications_Query,
    variables: {
      where: {
        onlyUnread,
      },
    },
  });

  const notifications = unpackMaybes(data?.notifications.data);

  return (
    <>
      <NotificationActions onlyUnread={onlyUnread} />
      <Pending inline fetching={fetching} error={error}>
        {notifications.length > 0 ? (
          <ul
            data-h2-list-style="base(none)"
            data-h2-padding="base(0)"
            data-h2-margin="base(x1 0)"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x.25 0)"
          >
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </ul>
        ) : (
          <Well>
            <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x1)">
              {intl.formatMessage({
                defaultMessage: "There aren't any notification here yet.",
                id: "5BRZs6",
                description: "Title for the no notifications message",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "As you receive notifications, they'll appear here and automatically be categorized on whether you've actioned or pinned them.",
                id: "91KsMq",
                description:
                  "Explanation of how the list of notifications work",
              })}
            </p>
          </Well>
        )}
      </Pending>
    </>
  );
};

export default NotificationList;
