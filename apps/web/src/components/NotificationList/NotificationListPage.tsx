import React from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";
import { useSearchParams } from "react-router-dom";

import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Link, Pending, Well } from "@gc-digital-talent/ui";

import NotificationItem from "./NotificationItem";

const Notifications_Query = graphql(/* GraphQL */ `
  query Notifications(
    $where: NotificationFilterInput
    $first: Int
    $page: Int
  ) {
    notifications(where: $where, first: $first, page: $page) {
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
}

const NotificationListPage = ({
  page,
  onlyUnread,
  isLastPage,
}: NotificationPageProps) => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  searchParams.set("page", `${page + 1}`);
  const [{ data, fetching, error }] = useQuery({
    query: Notifications_Query,
    variables: {
      first: PER_PAGE,
      page,
      where: {
        onlyUnread,
      },
    },
  });

  const notifications = unpackMaybes(data?.notifications?.data);

  if (notifications.length === 0 && page === 1 && !fetching) {
    return (
      <Well>
        <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x1)">
          {intl.formatMessage({
            defaultMessage: "There aren't any notifications here yet.",
            id: "0x2Ncn",
            description: "Title for the no notifications message",
          })}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "As you receive notifications, they'll appear here and automatically be categorized on whether you've actioned or pinned them.",
            id: "91KsMq",
            description: "Explanation of how the list of notifications work",
          })}
        </p>
      </Well>
    );
  }

  return (
    <>
      <Pending inline fetching={fetching} error={error}>
        {notifications.length > 0 ? (
          <ul
            data-h2-list-style="base(none)"
            data-h2-padding="base(0)"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x.25 0)"
            data-h2-margin-bottom="base(x.25)"
          >
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </ul>
        ) : null}
      </Pending>
      {isLastPage && data?.notifications.paginatorInfo.hasMorePages && (
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
      )}
    </>
  );
};

export default NotificationListPage;
