import React from "react";
import { useSearchParams } from "react-router-dom";

import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";

import NotificationActions from "./NotificationActions";
import NotificationListPage from "./NotificationListPage";
import usePollingQuery from "../../hooks/usePollingQuery";
import NotificationItem from "./NotificationItem";
import NotificationPortal from "./NotificationPortal";

const NotificationPolling_Query = graphql(/* GraphQL */ `
  query NotificationPolling($where: NotificationFilterInput) {
    notifications(where: $where) {
      data {
        id
        ...NotificationItem
      }
    }
  }
`);

const pageLoadedAt = nowUTCDateTime();

interface NotificationListProps {
  live?: boolean;
}

const NotificationList = ({ live }: NotificationListProps) => {
  const now = nowUTCDateTime();
  const [searchParams] = useSearchParams();
  const [{ data }] = usePollingQuery(
    {
      query: NotificationPolling_Query,
      pause: !live,
      variables: {
        where: {
          createdAt: {
            from: pageLoadedAt,
            to: now,
          },
        },
      },
    },
    120, // 2 mins
  );
  const pagesToLoad = searchParams.has("page")
    ? Number(searchParams.get("page"))
    : 1;
  const onlyUnread =
    searchParams.has("unread") && searchParams.get("unread") !== null;

  const pagesArray = Array.from(Array(pagesToLoad).keys());
  const liveNotifications = unpackMaybes(data?.notifications?.data);
  const liveIds = liveNotifications.map(({ id }) => id);

  return (
    <>
      <NotificationActions onlyUnread={onlyUnread} />
      <ul
        data-h2-list-style="base(none)"
        data-h2-padding="base(0)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x.25 0)"
        data-h2-margin="base(x1 0)"
      >
        {liveNotifications.length > 0 ? (
          <>
            {liveNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </>
        ) : null}
        {pagesArray.map((page) => {
          const currentPage = page + 1;
          return (
            <NotificationListPage
              key={`notification-page-${currentPage}`}
              page={currentPage}
              exclude={liveIds}
              isLastPage={currentPage === pagesToLoad}
              onlyUnread={onlyUnread}
            />
          );
        })}
      </ul>
      <NotificationPortal.Containers />
    </>
  );
};

export default NotificationList;
