import { useIntl } from "react-intl";
import { useQuery } from "urql";
import { useSearchParams } from "react-router-dom";
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
  exclude?: Scalars["UUID"]["input"][];
  first?: number;
  inDialog?: boolean;
  onRead?: () => void;
}

const NotificationListPage = ({
  page,
  first,
  onlyUnread,
  isLastPage,
  inDialog,
  onRead,
  exclude = [],
}: NotificationPageProps) => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  searchParams.set("page", `${page + 1}`);
  const [{ data, fetching }] = useQuery({
    query: Notifications_Query,
    variables: {
      excludeIds: exclude,
      first: first ?? PER_PAGE,
      page,
      where: {
        onlyUnread,
      },
    },
  });

  const notifications = unpackMaybes(data?.notifications?.data);

  const showNullMessage =
    notifications.length === 0 &&
    page === 1 &&
    !fetching &&
    exclude.length === 0;

  const firstNewNotification = useRef<HTMLAnchorElement>(null);

  return (
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
      {fetching && exclude.length === 0 && <Loading inline />}
      {showNullMessage && (
        <NotificationPortal.Portal
          containerId={NULL_MESSAGE_ROOT_ID}
          inDialog={inDialog}
        >
          <Well
            {...(inDialog && {
              "data-h2-margin": "base(0 x1)",
            })}
          >
            <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x1)">
              {intl.formatMessage({
                defaultMessage: "There aren't any notifications here.",
                id: "8JYRed",
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
        </NotificationPortal.Portal>
      )}
      {isLastPage && data?.notifications.paginatorInfo.hasMorePages && (
        <NotificationPortal.Portal containerId={LOAD_MORE_ROOT_ID}>
          <p data-h2-margin-top="base(x1)">
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
