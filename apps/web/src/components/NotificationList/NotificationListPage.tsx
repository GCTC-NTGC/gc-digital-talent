import { useIntl } from "react-intl";
import { useQuery } from "urql";
import { useSearchParams } from "react-router";
import { useRef } from "react";

import { Scalars, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Link, Loading, Well } from "@gc-digital-talent/ui";

import NotificationItem from "./NotificationItem";
import NotificationPortal, {
  LOAD_MORE_ROOT_ID,
  NULL_MESSAGE_ROOT_ID,
} from "./NotificationPortal";

const Notifications_Query = graphql(/* GraphQL */ `
  query Notifications(
    $where: NotificationFilterInput
    $excludeIds: [UUID!]
    $first: Int
    $page: Int
  ) {
    notifications(
      where: $where
      excludeIds: $excludeIds
      first: $first
      page: $page
    ) {
      paginatorInfo {
        hasMorePages
      }
      data {
        id
        ...NotificationItem
      }
    }
  }
`);

const PER_PAGE = 10;

interface NotificationPageProps {
  page: number;
  onlyUnread?: boolean;
  isLastPage?: boolean;
  excludeIds?: Scalars["UUID"]["input"][];
  first?: number;
  inDialog?: boolean;
  onRead?: () => void;
  fetchingLiveNotifications?: boolean;
}

const NotificationListPage = ({
  page,
  first,
  onlyUnread,
  isLastPage,
  inDialog,
  onRead,
  excludeIds = [],
  fetchingLiveNotifications,
}: NotificationPageProps) => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  searchParams.set("page", `${page + 1}`);
  const [{ data, fetching }] = useQuery({
    query: Notifications_Query,
    pause: fetchingLiveNotifications,
    variables: {
      excludeIds,
      first: first ?? PER_PAGE,
      page,
      where: {
        onlyUnread,
      },
    },
  });

  const notifications = unpackMaybes(data?.notifications?.data);

  const isLoading =
    (fetching || fetchingLiveNotifications) && excludeIds.length === 0;

  const showNullMessage =
    notifications.length === 0 &&
    page === 1 &&
    !fetching &&
    !fetchingLiveNotifications &&
    excludeIds.length === 0;

  const firstNewNotification = useRef<HTMLAnchorElement & HTMLButtonElement>(
    null,
  );

  return (
    <>
      {isLoading ? (
        <Loading inline />
      ) : (
        <>
          {notifications.length > 0 ? (
            <>
              {notifications.map((notification, index) => (
                <NotificationItem
                  key={notification.id}
                  focusRef={
                    index === 0 && page !== 1 ? firstNewNotification : undefined
                  }
                  notification={notification}
                  inDialog={inDialog}
                  onRead={onRead}
                />
              ))}
            </>
          ) : null}
        </>
      )}
      {showNullMessage && (
        <NotificationPortal.Portal
          containerId={NULL_MESSAGE_ROOT_ID}
          inDialog={inDialog}
        >
          <Well
            {...(inDialog && {
              className: "mx-6",
            })}
          >
            <p className="mb-6 font-bold">
              {intl.formatMessage({
                defaultMessage: "You don't have any new notifications.",
                id: "6cr+Qy",
                description: "Title for the no notifications message",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Check back here for alerts about a variety of activities on the platform, including job opportunities, new features, and more.",
                id: "d4aLWc",
                description:
                  "Explanation of how the list of notifications work",
              })}
            </p>
          </Well>
        </NotificationPortal.Portal>
      )}
      {isLastPage && data?.notifications.paginatorInfo.hasMorePages && (
        <NotificationPortal.Portal containerId={LOAD_MORE_ROOT_ID}>
          <p className="mt-6">
            <Link
              mode="solid"
              color="secondary"
              href={`?${searchParams.toString()}`}
            >
              {intl.formatMessage({
                defaultMessage: "Load more",
                id: "MuE3Gy",
                description: "Button text to load more notifications",
              })}
            </Link>
          </p>
        </NotificationPortal.Portal>
      )}
    </>
  );
};

export default NotificationListPage;
