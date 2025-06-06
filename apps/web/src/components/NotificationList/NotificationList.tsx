import { useSearchParams } from "react-router";
import { useQuery } from "urql";
import { tv } from "tailwind-variants";

import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { nowUTCDateTime } from "@gc-digital-talent/date-helpers";

import usePollingQuery from "~/hooks/usePollingQuery";

import NotificationActions from "./NotificationActions";
import NotificationListPage from "./NotificationListPage";
import NotificationItem from "./NotificationItem";
import NotificationPortal from "./NotificationPortal";

const actions = tv({
  base: "flex list-none flex-col p-0",
  variants: {
    inDialog: {
      false: "gap-y-1.5",
    },
  },
});

const MaxNotificationPages_Query = graphql(/* GraphQL */ `
  query MaxNotificationPages($where: NotificationFilterInput) {
    notifications(where: $where, page: 1, first: 10) {
      paginatorInfo {
        lastPage
      }
    }
  }
`);

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
  paginate?: boolean;
  limit?: number;
  inDialog?: boolean;
  onRead?: () => void;
}

const NotificationList = ({
  live,
  paginate,
  limit,
  inDialog,
  onRead,
}: NotificationListProps) => {
  const now = nowUTCDateTime();
  const [searchParams] = useSearchParams();
  const onlyUnread =
    searchParams.has("unread") && searchParams.get("unread") !== null;
  const [{ data: maxPagesData, fetching: fetchingMaxPages }] = useQuery({
    query: MaxNotificationPages_Query,
    variables: {
      where: { onlyUnread },
    },
  });
  const [{ data, fetching: fetchingLiveNotifications }] = usePollingQuery(
    {
      query: NotificationPolling_Query,
      pause: !live || fetchingMaxPages,
      variables: {
        where: {
          createdAt: {
            from: pageLoadedAt,
            to: now,
          },
        },
      },
    },
    60,
  );
  const lastPage = maxPagesData?.notifications.paginatorInfo.lastPage ?? 1;
  let pagesToLoad =
    paginate && searchParams.has("page") ? Number(searchParams.get("page")) : 1;
  if (pagesToLoad > lastPage) {
    pagesToLoad = lastPage;
  }

  const pagesArray = Array.from(Array(pagesToLoad).keys());
  const liveNotifications = unpackMaybes(data?.notifications?.data);
  const liveIds = liveNotifications.map(({ id }) => id);
  return (
    <>
      <NotificationActions
        onRead={onRead}
        onlyUnread={onlyUnread}
        inDialog={inDialog}
      />
      <ul className={actions({ inDialog })}>
        {liveNotifications.length > 0 ? (
          <>
            {liveNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                inDialog={inDialog}
                onRead={onRead}
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
              excludeIds={liveIds}
              isLastPage={currentPage === pagesToLoad}
              onlyUnread={onlyUnread}
              inDialog={inDialog}
              onRead={onRead}
              {...((!paginate || limit) && {
                first: limit ?? 100,
              })}
              fetchingLiveNotifications={
                fetchingLiveNotifications || fetchingMaxPages
              }
            />
          );
        })}
      </ul>
      <NotificationPortal.Containers inDialog={inDialog} />
    </>
  );
};

export default NotificationList;
